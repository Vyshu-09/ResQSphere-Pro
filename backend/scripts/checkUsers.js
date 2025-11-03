const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find().select('-password');
    console.log('\n📊 Current Users in Database:');
    console.log(`Total Users: ${users.length}\n`);

    if (users.length === 0) {
      console.log('❌ No users found!');
      console.log('Run: npm run seed to create default users\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} (${user.email})`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.verificationStatus}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });
    }

    // Check for default users specifically
    const responder = await User.findOne({ email: 'responder@resqsphere.com' });
    const civilian = await User.findOne({ email: 'civilian@resqsphere.com' });

    console.log('\n🔍 Default Users Status:');
    console.log(`Emergency Responder: ${responder ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    console.log(`Civilian User: ${civilian ? '✅ EXISTS' : '❌ NOT FOUND'}`);

    if (!responder || !civilian) {
      console.log('\n⚠️  Run this command to create default users:');
      console.log('   npm run seed');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();

