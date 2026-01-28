# Tests

This directory contains all test files for the backend application.

## Test Structure:

```
tests/
├── unit/                 # Unit tests (models, services, utils)
│   ├── models/
│   ├── services/
│   └── utils/
│
├── integration/          # Integration tests (routes, controllers)
│   ├── auth.test.js
│   ├── users.test.js
│   ├── pets.test.js
│   ├── bookings.test.js
│   └── ...
│
├── fixtures/            # Test data and fixtures
│   ├── users.json
│   ├── pets.json
│   └── bookings.json
│
├── helpers/             # Test helper functions
│   ├── setupTestDB.js
│   ├── generateToken.js
│   └── mockData.js
│
└── config/              # Test configuration
    └── jest.config.js
```

## Testing Stack:

- **Test Framework:** Jest
- **API Testing:** Supertest
- **Mocking:** Jest mocks
- **Coverage:** Jest coverage
- **Database:** MongoDB Memory Server (for isolated tests)

## Test Types:

### 1. Unit Tests
Test individual functions, methods, and classes in isolation.

```javascript
// tests/unit/services/authService.test.js
const AuthService = require('../../../src/services/authService');

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'Test123!';
      const hashed = await AuthService.hashPassword(password);
      
      expect(hashed).not.toBe(password);
      expect(hashed).toHaveLength(60);
    });
  });
});
```

### 2. Integration Tests
Test API endpoints with actual HTTP requests.

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const { setupTestDB } = require('../helpers/setupTestDB');

setupTestDB();

describe('Auth Routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
          role: 'owner',
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+1234567890'
          }
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });
  });
});
```

### 3. Model Tests
```javascript
// tests/unit/models/User.test.js
const User = require('../../../src/models/User');

describe('User Model', () => {
  it('should validate required fields', async () => {
    const user = new User({});
    
    let error;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });
});
```

## Test Helpers:

### setupTestDB.js
```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to test database
const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Clean up after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
};

module.exports = { setupTestDB };
```

### generateToken.js
```javascript
const jwt = require('jsonwebtoken');

exports.generateTestToken = (userId, role = 'owner') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
```

## Running Tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should register"
```

## Test Coverage Goals:

- **Overall:** > 80%
- **Services:** > 90%
- **Controllers:** > 80%
- **Models:** > 85%
- **Utils:** > 90%

## Best Practices:

1. **AAA Pattern:** Arrange, Act, Assert
2. **Isolated Tests:** Each test should be independent
3. **Descriptive Names:** Clear test descriptions
4. **Mock External Services:** Don't make real API calls
5. **Test Edge Cases:** Not just happy paths
6. **Clean Up:** Reset state after each test
7. **Fast Tests:** Keep tests quick
8. **CI Integration:** Run tests on every commit

## Example Test Suite:

```javascript
describe('Booking Service', () => {
  // Setup
  beforeEach(() => {
    // Prepare test data
  });

  // Teardown
  afterEach(() => {
    // Clean up
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      // Test implementation
    });

    it('should throw error if pet not found', async () => {
      // Test implementation
    });

    it('should check availability before booking', async () => {
      // Test implementation
    });
  });
});
```
