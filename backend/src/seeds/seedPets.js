/**
 * Seed Database Script
 * Populate database with sample data for development
 * WARNING: This will delete existing data!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Pet = require('../models/Pet');
const { sampleUsers, samplePets } = require('./petSampleData');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Hash passwords for sample users
const hashPasswords = async (users) => {
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    })
  );
  return hashedUsers;
};

// Import data
const importData = async () => {
  try {
    console.log('🔄 Starting data import...\n');

    // Hash user passwords
    const usersWithHashedPasswords = await hashPasswords(sampleUsers);

    // Insert users
    await User.create(usersWithHashedPasswords);
    console.log('✅ Sample users imported');
    console.log(`   - ${sampleUsers.length} users created`);
    console.log(`   - Emails: ${sampleUsers.map(u => u.email).join(', ')}\n`);

    // Insert pets
    await Pet.create(samplePets);
    console.log('✅ Sample pets imported');
    console.log(`   - ${samplePets.length} pets created`);
    console.log(`   - Names: ${samplePets.map(p => p.name).join(', ')}\n`);

    console.log('✨ Data import completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: john@example.com | Password: Password123!');
    console.log('   Email: jane@example.com | Password: Password123!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    console.log('🗑️  Deleting existing data...\n');

    await User.deleteMany();
    console.log('✅ Users deleted');

    await Pet.deleteMany();
    console.log('✅ Pets deleted');

    console.log('\n✨ Data deletion completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting data:', error.message);
    process.exit(1);
  }
};

// Main function
const main = async () => {
  await connectDB();

  const args = process.argv[2];

  if (args === '-i' || args === '--import') {
    // Delete existing data first, then import
    await User.deleteMany();
    await Pet.deleteMany();
    await importData();
  } else if (args === '-d' || args === '--delete') {
    await deleteData();
  } else {
    console.log('Usage:');
    console.log('  Import data: node seeds/seedPets.js -i or --import');
    console.log('  Delete data: node seeds/seedPets.js -d or --delete');
    process.exit(0);
  }
};

// Run
main();
