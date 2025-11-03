const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing default users
    await User.deleteMany({
      $or: [
        { email: 'responder@resqsphere.com' },
        { email: 'civilian@resqsphere.com' }
      ]
    });

    // Use plain password - User model will hash it automatically via pre-save hook
    const plainPassword = 'password123';

    // Emergency Responder User
    const responder = await User.create({
      username: 'emergency_responder',
      email: 'responder@resqsphere.com',
      password: plainPassword,
      role: 'emergency_responder',
      profile: {
        firstName: 'John',
        lastName: 'Smith',
        phone: '+1-555-0101',
        address: '123 Emergency Response Street, Safety City, SC 12345'
      },
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      },
      verificationStatus: 'verified',
      preferences: {
        notifications: true,
        language: 'en',
        theme: 'light'
      }
    });

    // Civilian User
    const civilian = await User.create({
      username: 'civilian_user',
      email: 'civilian@resqsphere.com',
      password: plainPassword,
      role: 'civilian',
      profile: {
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '+1-555-0102',
        address: '456 Main Street, Safety City, SC 12345'
      },
      location: {
        latitude: 37.7849,
        longitude: -122.4094,
        address: 'Oakland, CA'
      },
      verificationStatus: 'verified',
      preferences: {
        notifications: true,
        language: 'en',
        theme: 'light'
      }
    });

    console.log('✅ Default users created successfully:');
    console.log('   Emergency Responder:', responder.email);
    console.log('   Civilian:', civilian.email);
    console.log('   Password for both: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

