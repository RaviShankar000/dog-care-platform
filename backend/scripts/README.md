# Scripts

This directory contains utility scripts for various tasks.

## Script Files:

- `seedDatabase.js` - Seed database with initial data
- `clearDatabase.js` - Clear all collections in database
- `createAdmin.js` - Create admin user
- `migrateData.js` - Data migration scripts
- `backupDatabase.js` - Database backup utility
- `generateDocs.js` - Generate API documentation
- `checkHealth.js` - System health check
- `updateIndexes.js` - Update database indexes
- `generateSitemap.js` - Generate sitemap for SEO

## Example Scripts:

### seedDatabase.js
```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Service = require('../src/models/Service');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Service.deleteMany();
    
    console.log('Seeding users...');
    await User.insertMany([
      // Sample users
    ]);
    
    console.log('Seeding services...');
    await Service.insertMany([
      // Sample services
    ]);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
```

### createAdmin.js
```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminEmail = process.argv[2];
    const adminPassword = process.argv[3];
    
    if (!adminEmail || !adminPassword) {
      console.error('Usage: node createAdmin.js <email> <password>');
      process.exit(1);
    }
    
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '+1234567890'
      },
      verification: {
        isEmailVerified: true,
        isPhoneVerified: true
      }
    });
    
    console.log(`Admin created: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Admin creation failed:', error);
    process.exit(1);
  }
};

createAdmin();
```

### migrateData.js
```javascript
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Starting migration...');
    
    // Migration logic here
    // Example: Add new field to existing documents
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
```

## Running Scripts:

```bash
# Seed database
node scripts/seedDatabase.js

# Create admin user
node scripts/createAdmin.js admin@example.com SecurePassword123!

# Clear database (use with caution!)
node scripts/clearDatabase.js

# Run migration
node scripts/migrateData.js

# Backup database
node scripts/backupDatabase.js
```

## Best Practices:

1. **Error Handling:** Always wrap in try-catch
2. **Logging:** Provide clear console output
3. **Confirmation:** Ask for confirmation before destructive operations
4. **Exit Codes:** Use proper exit codes (0 = success, 1 = error)
5. **Documentation:** Document script purpose and usage
6. **Environment:** Load environment variables
7. **Clean Up:** Close database connections
8. **Arguments:** Accept command-line arguments when needed
