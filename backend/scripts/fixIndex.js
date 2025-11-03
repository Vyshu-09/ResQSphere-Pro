const mongoose = require('mongoose');
const Incident = require('../models/Incident');
require('dotenv').config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop the old 2dsphere index if it exists
    try {
      await Incident.collection.dropIndex('location_2dsphere');
      console.log('✅ Dropped old 2dsphere index');
    } catch (err) {
      if (err.code === 27 || err.codeName === 'IndexNotFound') {
        console.log('ℹ️  Old index not found (already removed)');
      } else {
        throw err;
      }
    }

    // Drop all incidents to start fresh
    await Incident.deleteMany({});
    console.log('✅ Cleared all existing incidents');

    // Create new compound index
    await Incident.collection.createIndex({ 'location.latitude': 1, 'location.longitude': 1 });
    console.log('✅ Created new location index');

    console.log('✅ Index fix completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    process.exit(1);
  }
};

fixIndex();

