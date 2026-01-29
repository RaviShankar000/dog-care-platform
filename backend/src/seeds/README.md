# Sample Data Seeding

This directory contains sample data for local development and testing.

## ⚠️ WARNING
**DO NOT use this in production!** This data is for development purposes only.

## Usage

### Import Sample Data
```bash
# From backend directory
node src/seeds/seedPets.js -i
# or
node src/seeds/seedPets.js --import
```

This will:
- Delete all existing users and pets
- Create 2 sample users
- Create 4 sample pets (2 per user)
- Each pet includes vaccination and medical history data

### Delete All Data
```bash
node src/seeds/seedPets.js -d
# or
node src/seeds/seedPets.js --delete
```

## Test Credentials

After seeding, you can login with:

**User 1:**
- Email: `john@example.com`
- Password: `Password123!`
- Pets: Max (Golden Retriever), Bella (Labrador)

**User 2:**
- Email: `jane@example.com`
- Password: `Password123!`
- Pets: Charlie (German Shepherd), Luna (Beagle)

## Sample Data Includes

- ✅ Complete user profiles with addresses
- ✅ Pet details (name, breed, age, weight)
- ✅ Vaccination records with due dates
- ✅ Medical history with vet information
- ✅ Realistic timestamps and notes

## Files

- `petSampleData.js` - Sample data definitions
- `seedPets.js` - Seeding script with import/delete functionality
