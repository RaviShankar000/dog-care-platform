# Dog Care Platform - MongoDB Schema Design

## Overview
This document outlines the MongoDB schema design using Mongoose for the Dog Care Platform. Each collection includes field definitions, data types, validation rules, relationships, and indexing strategies for optimal performance.

---

## 1. Users Collection

**Purpose:** Store all platform users (Dog Owners, Caregivers/Employees, Admins)

### Schema Structure
```javascript
{
  _id: ObjectId,
  email: String (required, unique, lowercase, trim),
  passwordHash: String (required),
  role: String (enum: ['owner', 'employee', 'admin'], required),
  
  profile: {
    firstName: String (required, trim),
    lastName: String (required, trim),
    phoneNumber: String (required),
    avatar: String (URL),
    dateOfBirth: Date,
    gender: String (enum: ['male', 'female', 'other']),
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String (default: 'USA'),
      coordinates: {
        type: String (default: 'Point'),
        coordinates: [Number] // [longitude, latitude]
      }
    },
    bio: String (maxlength: 500)
  },
  
  verification: {
    isEmailVerified: Boolean (default: false),
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isPhoneVerified: Boolean (default: false),
    isIdentityVerified: Boolean (default: false) // For employees
  },
  
  security: {
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: Number (default: 0),
    lockUntil: Date,
    twoFactorEnabled: Boolean (default: false),
    twoFactorSecret: String
  },
  
  preferences: {
    notifications: {
      email: Boolean (default: true),
      sms: Boolean (default: true),
      push: Boolean (default: true)
    },
    language: String (default: 'en'),
    timezone: String (default: 'America/New_York')
  },
  
  status: String (enum: ['active', 'suspended', 'deactivated'], default: 'active'),
  
  metadata: {
    registrationSource: String (enum: ['web', 'mobile', 'admin']),
    referredBy: ObjectId (ref: 'User'),
    lastActive: Date
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { email: 1 } (unique)
- { role: 1 }
- { 'profile.address.coordinates': '2dsphere' } // Geospatial queries
- { status: 1, role: 1 }
- { createdAt: -1 }
- { 'verification.emailVerificationToken': 1 }
- { 'security.passwordResetToken': 1 }
```

### Relations
- Self-referencing: `metadata.referredBy` → Users._id
- Referenced by: Pets, Bookings, Orders, Reminders

---

## 2. Pets Collection

**Purpose:** Store dog profiles owned by users

### Schema Structure
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: 'User', required),
  
  basicInfo: {
    name: String (required, trim),
    breed: String (required),
    breedType: String (enum: ['purebred', 'mixed']),
    gender: String (enum: ['male', 'female'], required),
    dateOfBirth: Date (required),
    age: Number, // Calculated field
    color: String,
    weight: Number, // in pounds
    size: String (enum: ['small', 'medium', 'large', 'extra-large']),
    microchipId: String (unique, sparse)
  },
  
  photos: [{
    url: String (required),
    isPrimary: Boolean (default: false),
    uploadedAt: Date (default: Date.now)
  }],
  
  medicalInfo: {
    isSpayedNeutered: Boolean,
    allergies: [String],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date
    }],
    vaccinations: [{
      name: String (required),
      dateAdministered: Date (required),
      nextDueDate: Date,
      veterinarian: String,
      batchNumber: String
    }],
    chronicConditions: [String],
    specialNeeds: String (maxlength: 1000),
    lastVetVisit: Date,
    veterinarian: {
      name: String,
      clinicName: String,
      phoneNumber: String,
      email: String,
      address: String
    }
  },
  
  behaviorInfo: {
    temperament: [String], // ['friendly', 'energetic', 'shy', 'aggressive']
    training: [String], // ['housebroken', 'obedience', 'agility']
    socialization: {
      goodWithDogs: Boolean,
      goodWithCats: Boolean,
      goodWithKids: Boolean
    },
    specialBehaviors: String (maxlength: 500)
  },
  
  dietInfo: {
    foodType: String (enum: ['dry', 'wet', 'raw', 'mixed']),
    brand: String,
    portionSize: String,
    feedingSchedule: [String], // ['8:00 AM', '6:00 PM']
    dietaryRestrictions: [String],
    treats: String
  },
  
  emergencyContact: {
    name: String (required),
    relationship: String,
    phoneNumber: String (required),
    alternateNumber: String
  },
  
  status: String (enum: ['active', 'deceased', 'rehomed'], default: 'active'),
  
  metadata: {
    registrationNumber: String,
    insurance: {
      provider: String,
      policyNumber: String,
      expiryDate: Date
    }
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { ownerId: 1, status: 1 }
- { 'basicInfo.name': 1 }
- { 'basicInfo.microchipId': 1 } (unique, sparse)
- { 'basicInfo.breed': 1 }
- { createdAt: -1 }
- { status: 1 }
```

### Relations
- Parent: `ownerId` → Users._id
- Referenced by: Bookings, BreedingRecords

---

## 3. Employees Collection

**Purpose:** Store caregiver/employee profiles and service information

### Schema Structure
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required, unique),
  
  employmentInfo: {
    employeeId: String (unique, required),
    dateHired: Date (required),
    employmentType: String (enum: ['full-time', 'part-time', 'contractor'], required),
    status: String (enum: ['active', 'on-leave', 'terminated'], default: 'active'),
    department: String (enum: ['grooming', 'boarding', 'daycare', 'training', 'veterinary', 'general'])
  },
  
  serviceInfo: {
    services: [{
      type: String (enum: ['boarding', 'daycare', 'walking', 'grooming', 'training', 'sitting']),
      isActive: Boolean (default: true)
    }],
    specializations: [String], // ['puppy-care', 'senior-care', 'special-needs']
    experienceYears: Number,
    maxPetsPerSession: Number (default: 5)
  },
  
  availability: {
    schedule: [{
      dayOfWeek: Number (0-6, 0 = Sunday),
      isAvailable: Boolean (default: true),
      timeSlots: [{
        startTime: String, // '09:00'
        endTime: String, // '17:00'
        isBooked: Boolean (default: false)
      }]
    }],
    vacationDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }],
    blackoutDates: [Date]
  },
  
  pricing: {
    hourlyRate: Number,
    servicePricing: [{
      serviceType: String,
      basePrice: Number,
      additionalPetPrice: Number,
      currency: String (default: 'USD')
    }]
  },
  
  qualifications: {
    certifications: [{
      name: String (required),
      issuingOrganization: String,
      certificateNumber: String,
      issueDate: Date,
      expiryDate: Date,
      documentUrl: String
    }],
    education: [{
      degree: String,
      institution: String,
      graduationYear: Number
    }],
    licenses: [{
      type: String,
      licenseNumber: String,
      state: String,
      expiryDate: Date
    }]
  },
  
  backgroundCheck: {
    status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
    performedDate: Date,
    expiryDate: Date,
    provider: String,
    referenceNumber: String
  },
  
  insurance: {
    provider: String,
    policyNumber: String,
    coverageAmount: Number,
    expiryDate: Date,
    documentUrl: String
  },
  
  performance: {
    rating: Number (min: 0, max: 5, default: 0),
    totalReviews: Number (default: 0),
    totalBookings: Number (default: 0),
    completedBookings: Number (default: 0),
    canceledBookings: Number (default: 0),
    responseTime: Number // in minutes (average)
  },
  
  serviceArea: {
    radius: Number, // in miles
    centerPoint: {
      type: String (default: 'Point'),
      coordinates: [Number] // [longitude, latitude]
    },
    zipCodes: [String]
  },
  
  bankingInfo: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String (encrypted),
    routingNumber: String (encrypted),
    paymentMethod: String (enum: ['bank-transfer', 'paypal', 'stripe']),
    paypalEmail: String,
    stripeAccountId: String
  },
  
  earnings: {
    totalEarned: Number (default: 0),
    pendingPayout: Number (default: 0),
    lastPayoutDate: Date,
    currency: String (default: 'USD')
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { userId: 1 } (unique)
- { 'employmentInfo.employeeId': 1 } (unique)
- { 'employmentInfo.status': 1 }
- { 'serviceInfo.services.type': 1 }
- { 'performance.rating': -1 }
- { 'serviceArea.centerPoint': '2dsphere' }
- { 'availability.schedule.dayOfWeek': 1 }
- { createdAt: -1 }
```

### Relations
- Parent: `userId` → Users._id
- Referenced by: Bookings, Services

---

## 4. Services Collection

**Purpose:** Define service offerings and pricing

### Schema Structure
```javascript
{
  _id: ObjectId,
  
  serviceInfo: {
    name: String (required, trim),
    slug: String (unique, required, lowercase),
    category: String (enum: ['boarding', 'daycare', 'walking', 'grooming', 'training', 'sitting', 'veterinary'], required),
    description: String (required, maxlength: 2000),
    shortDescription: String (maxlength: 200)
  },
  
  pricing: {
    basePrice: Number (required),
    currency: String (default: 'USD'),
    pricingModel: String (enum: ['per-hour', 'per-day', 'per-session', 'per-week', 'flat-rate'], required),
    additionalPetPrice: Number,
    discounts: [{
      type: String (enum: ['multi-pet', 'recurring', 'seasonal', 'loyalty']),
      percentage: Number,
      conditions: String
    }]
  },
  
  duration: {
    min: Number, // in minutes
    max: Number,
    typical: Number
  },
  
  requirements: {
    minAge: Number, // in months
    maxAge: Number,
    sizeRestrictions: [String], // ['small', 'medium', 'large']
    breedRestrictions: [String],
    vaccinationRequired: Boolean (default: true),
    requiredVaccinations: [String]
  },
  
  features: [String], // ['24/7 supervision', 'climate-controlled', 'spacious runs']
  
  availability: {
    daysAvailable: [Number], // [0-6, 0 = Sunday]
    hoursOperation: {
      startTime: String, // '08:00'
      endTime: String // '18:00'
    },
    advanceBookingDays: Number (default: 1),
    maxBookingDays: Number (default: 365)
  },
  
  media: {
    images: [String], // URLs
    videos: [String],
    thumbnail: String
  },
  
  capacity: {
    maxPetsPerSession: Number,
    maxDailyBookings: Number
  },
  
  addOns: [{
    name: String,
    description: String,
    price: Number,
    isAvailable: Boolean (default: true)
  }],
  
  status: String (enum: ['active', 'inactive', 'coming-soon'], default: 'active'),
  
  metadata: {
    popularityScore: Number (default: 0),
    totalBookings: Number (default: 0),
    viewCount: Number (default: 0),
    averageRating: Number (min: 0, max: 5, default: 0)
  },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { 'serviceInfo.slug': 1 } (unique)
- { 'serviceInfo.category': 1, status: 1 }
- { status: 1 }
- { 'metadata.popularityScore': -1 }
- { 'metadata.averageRating': -1 }
- { createdAt: -1 }
```

### Relations
- Referenced by: Bookings, Orders

---

## 5. Bookings Collection

**Purpose:** Manage service bookings and appointments

### Schema Structure
```javascript
{
  _id: ObjectId,
  bookingNumber: String (unique, required), // Auto-generated: BKG-YYYYMMDD-XXXX
  
  customerInfo: {
    userId: ObjectId (ref: 'User', required),
    petIds: [ObjectId] (ref: 'Pet', required)
  },
  
  serviceInfo: {
    serviceId: ObjectId (ref: 'Service', required),
    employeeId: ObjectId (ref: 'Employee'),
    serviceType: String (required),
    serviceName: String (required)
  },
  
  schedule: {
    startDate: Date (required),
    endDate: Date,
    startTime: String, // '09:00'
    endTime: String,
    duration: Number, // in minutes
    timezone: String (default: 'America/New_York')
  },
  
  pricing: {
    basePrice: Number (required),
    additionalPetCharge: Number (default: 0),
    addOnCharges: [{
      name: String,
      price: Number
    }],
    discountApplied: Number (default: 0),
    subtotal: Number (required),
    tax: Number (default: 0),
    platformFee: Number (default: 0),
    totalAmount: Number (required),
    currency: String (default: 'USD')
  },
  
  status: String (enum: [
    'pending',
    'confirmed',
    'in-progress',
    'completed',
    'canceled',
    'no-show',
    'refunded'
  ], default: 'pending'),
  
  statusHistory: [{
    status: String,
    changedAt: Date (default: Date.now),
    changedBy: ObjectId (ref: 'User'),
    reason: String
  }],
  
  payment: {
    status: String (enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending'),
    method: String (enum: ['card', 'paypal', 'cash', 'bank-transfer']),
    transactionId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  
  specialInstructions: String (maxlength: 1000),
  
  checkIn: {
    time: Date,
    checkedInBy: ObjectId (ref: 'Employee'),
    notes: String,
    photos: [String]
  },
  
  checkOut: {
    time: Date,
    checkedOutBy: ObjectId (ref: 'Employee'),
    notes: String,
    photos: [String],
    reportCard: String // Summary of service
  },
  
  cancellation: {
    canceledAt: Date,
    canceledBy: ObjectId (ref: 'User'),
    reason: String,
    cancellationFee: Number (default: 0)
  },
  
  notifications: {
    reminderSent: Boolean (default: false),
    confirmationSent: Boolean (default: false),
    completionSent: Boolean (default: false)
  },
  
  metadata: {
    source: String (enum: ['web', 'mobile', 'admin', 'phone']),
    ipAddress: String,
    userAgent: String,
    isRecurring: Boolean (default: false),
    parentBookingId: ObjectId (ref: 'Booking') // For recurring bookings
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { bookingNumber: 1 } (unique)
- { 'customerInfo.userId': 1, status: 1 }
- { 'customerInfo.petIds': 1 }
- { 'serviceInfo.employeeId': 1, status: 1 }
- { 'schedule.startDate': 1, status: 1 }
- { status: 1 }
- { createdAt: -1 }
- { 'payment.status': 1 }
```

### Relations
- Parent: `customerInfo.userId` → Users._id
- Parent: `customerInfo.petIds` → Pets._id
- Parent: `serviceInfo.serviceId` → Services._id
- Parent: `serviceInfo.employeeId` → Employees._id

---

## 6. Products Collection

**Purpose:** Store pet products for e-commerce

### Schema Structure
```javascript
{
  _id: ObjectId,
  
  productInfo: {
    name: String (required, trim),
    slug: String (unique, required, lowercase),
    sku: String (unique, required),
    brand: String,
    category: String (enum: ['food', 'toys', 'accessories', 'grooming', 'health', 'training'], required),
    subCategory: String,
    description: String (required, maxlength: 3000),
    shortDescription: String (maxlength: 200)
  },
  
  pricing: {
    regularPrice: Number (required),
    salePrice: Number,
    currency: String (default: 'USD'),
    costPrice: Number, // For profit calculation
    isOnSale: Boolean (default: false),
    saleStartDate: Date,
    saleEndDate: Date
  },
  
  inventory: {
    stockQuantity: Number (required, default: 0),
    lowStockThreshold: Number (default: 10),
    isInStock: Boolean (default: true),
    allowBackorder: Boolean (default: false),
    trackInventory: Boolean (default: true)
  },
  
  specifications: {
    weight: Number, // in pounds
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String (default: 'inches')
    },
    color: [String],
    size: [String], // ['Small', 'Medium', 'Large']
    material: String,
    ageRange: String, // 'Puppy', 'Adult', 'Senior'
  },
  
  variants: [{
    sku: String (unique),
    name: String,
    attributes: {
      color: String,
      size: String
    },
    price: Number,
    stockQuantity: Number,
    images: [String]
  }],
  
  media: {
    images: [{
      url: String (required),
      alt: String,
      isPrimary: Boolean (default: false),
      order: Number
    }],
    videos: [String]
  },
  
  suitability: {
    petTypes: [String], // ['dog', 'cat']
    breeds: [String],
    sizes: [String], // ['small', 'medium', 'large']
    ageGroups: [String] // ['puppy', 'adult', 'senior']
  },
  
  shipping: {
    weight: Number (required),
    freeShipping: Boolean (default: false),
    shippingClass: String (enum: ['standard', 'fragile', 'perishable']),
    estimatedDeliveryDays: Number
  },
  
  ratings: {
    average: Number (min: 0, max: 5, default: 0),
    count: Number (default: 0),
    distribution: {
      star5: Number (default: 0),
      star4: Number (default: 0),
      star3: Number (default: 0),
      star2: Number (default: 0),
      star1: Number (default: 0)
    }
  },
  
  tags: [String],
  
  status: String (enum: ['active', 'inactive', 'discontinued'], default: 'active'),
  
  metadata: {
    viewCount: Number (default: 0),
    purchaseCount: Number (default: 0),
    featured: Boolean (default: false),
    isNew: Boolean (default: false),
    manufacturer: String
  },
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { 'productInfo.slug': 1 } (unique)
- { 'productInfo.sku': 1 } (unique)
- { 'productInfo.category': 1, status: 1 }
- { status: 1 }
- { 'ratings.average': -1 }
- { 'inventory.isInStock': 1 }
- { 'metadata.featured': 1 }
- { createdAt: -1 }
- { 'tags': 1 }
```

### Relations
- Referenced by: Orders (orderItems)

---

## 7. Orders Collection

**Purpose:** Manage product purchases and transactions

### Schema Structure
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique, required), // Auto-generated: ORD-YYYYMMDD-XXXX
  
  customer: {
    userId: ObjectId (ref: 'User', required),
    email: String (required),
    phone: String
  },
  
  orderItems: [{
    productId: ObjectId (ref: 'Product', required),
    productName: String (required),
    sku: String (required),
    variant: {
      variantId: String,
      attributes: Object // { color: 'Red', size: 'M' }
    },
    quantity: Number (required, min: 1),
    unitPrice: Number (required),
    totalPrice: Number (required),
    discount: Number (default: 0)
  }],
  
  pricing: {
    subtotal: Number (required),
    shippingCost: Number (default: 0),
    tax: Number (default: 0),
    discount: Number (default: 0),
    totalAmount: Number (required),
    currency: String (default: 'USD')
  },
  
  discounts: [{
    code: String,
    type: String (enum: ['percentage', 'fixed', 'shipping']),
    amount: Number,
    description: String
  }],
  
  shippingAddress: {
    fullName: String (required),
    phoneNumber: String (required),
    street: String (required),
    apartment: String,
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required, default: 'USA'),
    instructions: String
  },
  
  billingAddress: {
    fullName: String (required),
    street: String (required),
    apartment: String,
    city: String (required),
    state: String (required),
    zipCode: String (required),
    country: String (required, default: 'USA'),
    sameAsShipping: Boolean (default: true)
  },
  
  payment: {
    method: String (enum: ['card', 'paypal', 'cash-on-delivery'], required),
    status: String (enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending'),
    transactionId: String,
    paidAt: Date,
    cardLast4: String,
    refunds: [{
      amount: Number,
      reason: String,
      refundedAt: Date,
      transactionId: String
    }]
  },
  
  shipping: {
    method: String (enum: ['standard', 'express', 'overnight', 'pickup'], required),
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
    shippingStatus: String (enum: ['pending', 'processing', 'shipped', 'in-transit', 'delivered', 'failed'], default: 'pending')
  },
  
  status: String (enum: [
    'pending',
    'processing',
    'confirmed',
    'shipped',
    'delivered',
    'canceled',
    'refunded',
    'returned'
  ], default: 'pending'),
  
  statusHistory: [{
    status: String,
    timestamp: Date (default: Date.now),
    note: String,
    updatedBy: ObjectId (ref: 'User')
  }],
  
  notes: {
    customerNote: String,
    internalNote: String
  },
  
  fulfillment: {
    preparedBy: ObjectId (ref: 'Employee'),
    packedAt: Date,
    packingSlip: String,
    invoiceUrl: String
  },
  
  metadata: {
    source: String (enum: ['web', 'mobile', 'admin', 'phone']),
    ipAddress: String,
    userAgent: String
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { orderNumber: 1 } (unique)
- { 'customer.userId': 1, status: 1 }
- { 'payment.status': 1 }
- { 'shipping.shippingStatus': 1 }
- { status: 1 }
- { createdAt: -1 }
- { 'orderItems.productId': 1 }
```

### Relations
- Parent: `customer.userId` → Users._id
- Parent: `orderItems.productId` → Products._id
- Parent: `fulfillment.preparedBy` → Employees._id

---

## 8. Reminders Collection

**Purpose:** Manage scheduled reminders and notifications

### Schema Structure
```javascript
{
  _id: ObjectId,
  
  userInfo: {
    userId: ObjectId (ref: 'User', required),
    petId: ObjectId (ref: 'Pet')
  },
  
  reminderInfo: {
    title: String (required, trim),
    description: String (maxlength: 500),
    type: String (enum: [
      'vaccination',
      'medication',
      'vet-appointment',
      'grooming',
      'flea-tick-treatment',
      'birthday',
      'license-renewal',
      'insurance-renewal',
      'custom'
    ], required),
    priority: String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium')
  },
  
  schedule: {
    reminderDate: Date (required),
    reminderTime: String, // '10:00'
    timezone: String (default: 'America/New_York'),
    isRecurring: Boolean (default: false),
    recurrence: {
      frequency: String (enum: ['daily', 'weekly', 'monthly', 'yearly']),
      interval: Number (default: 1), // Every X days/weeks/months
      endDate: Date,
      daysOfWeek: [Number], // For weekly: [0,2,4] = Sun, Tue, Thu
      dayOfMonth: Number // For monthly: 15 = 15th of each month
    }
  },
  
  notification: {
    methods: [String], // ['email', 'sms', 'push']
    advanceNotice: Number, // in minutes (e.g., 60 = 1 hour before)
    sent: Boolean (default: false),
    sentAt: Date,
    deliveryStatus: String (enum: ['pending', 'sent', 'delivered', 'failed'])
  },
  
  relatedData: {
    bookingId: ObjectId (ref: 'Booking'),
    medicalRecordId: String,
    customData: Object // Additional context
  },
  
  completion: {
    isCompleted: Boolean (default: false),
    completedAt: Date,
    completedBy: ObjectId (ref: 'User'),
    notes: String
  },
  
  status: String (enum: ['active', 'completed', 'canceled', 'snoozed'], default: 'active'),
  
  snooze: {
    snoozeUntil: Date,
    snoozeCount: Number (default: 0)
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { 'userInfo.userId': 1, status: 1 }
- { 'userInfo.petId': 1 }
- { 'schedule.reminderDate': 1, status: 1 }
- { 'reminderInfo.type': 1 }
- { status: 1 }
- { 'notification.sent': 1, 'schedule.reminderDate': 1 }
- { createdAt: -1 }
```

### Relations
- Parent: `userInfo.userId` → Users._id
- Parent: `userInfo.petId` → Pets._id
- Parent: `relatedData.bookingId` → Bookings._id

---

## 9. BreedingRecords Collection

**Purpose:** Manage breeding and adoption records

### Schema Structure
```javascript
{
  _id: ObjectId,
  recordNumber: String (unique, required), // AUTO: BRD-YYYYMMDD-XXXX
  
  type: String (enum: ['breeding', 'adoption'], required),
  
  // Breeding specific fields
  breeding: {
    sireId: ObjectId (ref: 'Pet'),
    damId: ObjectId (ref: 'Pet'),
    breedingDate: Date,
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    litterSize: Number,
    complications: String,
    veterinarian: {
      name: String,
      clinic: String,
      phone: String
    }
  },
  
  // Litter information (for breeding)
  litter: [{
    puppyId: ObjectId (ref: 'Pet'),
    name: String,
    gender: String (enum: ['male', 'female']),
    weight: Number, // at birth
    color: String,
    markings: String,
    healthStatus: String (enum: ['healthy', 'needs-attention', 'deceased']),
    status: String (enum: ['available', 'reserved', 'adopted', 'retained'], default: 'available'),
    price: Number,
    microchipped: Boolean (default: false),
    microchipId: String
  }],
  
  // Adoption specific fields
  adoption: {
    petId: ObjectId (ref: 'Pet', required),
    previousOwner: {
      name: String,
      contact: String,
      reason: String // Reason for giving up
    },
    intakeDate: Date (required),
    intakeSource: String (enum: ['owner-surrender', 'rescue', 'stray', 'breeding']),
    healthCheck: {
      performedDate: Date,
      veterinarian: String,
      healthStatus: String,
      spayedNeutered: Boolean,
      vaccinations: [String],
      notes: String
    },
    behaviorAssessment: {
      assessmentDate: Date,
      assessor: String,
      temperament: [String],
      notes: String,
      adoptionRecommendations: String
    }
  },
  
  // Adoption process
  adoptionProcess: {
    status: String (enum: [
      'available',
      'under-review',
      'approved',
      'adopted',
      'on-hold',
      'not-available'
    ], default: 'available'),
    listedDate: Date,
    adoptionFee: Number,
    applications: [{
      applicantId: ObjectId (ref: 'User'),
      appliedDate: Date,
      status: String (enum: ['pending', 'approved', 'rejected', 'withdrawn']),
      interviewDate: Date,
      homeVisitDate: Date,
      notes: String
    }],
    adoptedBy: ObjectId (ref: 'User'),
    adoptionDate: Date,
    adoptionContract: {
      signedDate: Date,
      documentUrl: String,
      terms: String
    },
    followUp: [{
      scheduledDate: Date,
      completedDate: Date,
      method: String (enum: ['phone', 'email', 'home-visit']),
      notes: String,
      satisfactory: Boolean
    }]
  },
  
  documents: [{
    type: String (enum: ['contract', 'health-certificate', 'pedigree', 'registration', 'photo', 'other']),
    name: String,
    url: String (required),
    uploadedAt: Date (default: Date.now)
  }],
  
  financials: {
    totalRevenue: Number (default: 0),
    expenses: [{
      category: String,
      amount: Number,
      description: String,
      date: Date
    }],
    profit: Number
  },
  
  notes: String (maxlength: 2000),
  
  status: String (enum: ['active', 'completed', 'canceled'], default: 'active'),
  
  metadata: {
    createdBy: ObjectId (ref: 'User'),
    lastUpdatedBy: ObjectId (ref: 'User')
  },
  
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### Indexes
```javascript
- { recordNumber: 1 } (unique)
- { type: 1, status: 1 }
- { 'breeding.sireId': 1 }
- { 'breeding.damId': 1 }
- { 'adoption.petId': 1 }
- { 'adoptionProcess.status': 1 }
- { 'adoptionProcess.adoptedBy': 1 }
- { 'litter.status': 1 }
- { createdAt: -1 }
```

### Relations
- Parent: `breeding.sireId` → Pets._id
- Parent: `breeding.damId` → Pets._id
- Parent: `litter.puppyId` → Pets._id
- Parent: `adoption.petId` → Pets._id
- Parent: `adoptionProcess.applications.applicantId` → Users._id
- Parent: `adoptionProcess.adoptedBy` → Users._id

---

## Additional Collections (Supporting)

### 10. Reviews Collection
```javascript
{
  _id: ObjectId,
  targetType: String (enum: ['employee', 'service', 'product'], required),
  targetId: ObjectId (required),
  reviewerId: ObjectId (ref: 'User', required),
  bookingId: ObjectId (ref: 'Booking'), // For service/employee reviews
  orderId: ObjectId (ref: 'Order'), // For product reviews
  rating: Number (min: 1, max: 5, required),
  title: String,
  comment: String (maxlength: 1000),
  photos: [String],
  response: {
    comment: String,
    respondedBy: ObjectId (ref: 'User'),
    respondedAt: Date
  },
  isVerified: Boolean (default: true),
  isReported: Boolean (default: false),
  status: String (enum: ['active', 'hidden', 'removed'], default: 'active'),
  helpfulCount: Number (default: 0),
  createdAt: Date (default: Date.now),
  updatedAt: Date
}
```

### 11. Messages Collection
```javascript
{
  _id: ObjectId,
  conversationId: String (required, indexed),
  senderId: ObjectId (ref: 'User', required),
  receiverId: ObjectId (ref: 'User', required),
  bookingId: ObjectId (ref: 'Booking'),
  content: {
    text: String (maxlength: 2000),
    type: String (enum: ['text', 'image', 'video', 'file'], default: 'text'),
    mediaUrl: String
  },
  status: String (enum: ['sent', 'delivered', 'read'], default: 'sent'),
  isRead: Boolean (default: false),
  readAt: Date,
  isDeleted: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

### 12. Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: [
    'booking-confirmed',
    'booking-reminder',
    'payment-received',
    'review-request',
    'message-received',
    'order-shipped',
    'system-alert'
  ], required),
  title: String (required),
  message: String (required),
  data: Object, // Additional context
  isRead: Boolean (default: false),
  readAt: Date,
  actionUrl: String,
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  createdAt: Date (default: Date.now)
}
```

---

## Database Relationships Summary

```
Users (1) ───→ (M) Pets
Users (1) ───→ (1) Employees
Users (1) ───→ (M) Bookings
Users (1) ───→ (M) Orders
Users (1) ───→ (M) Reminders
Users (1) ───→ (M) Reviews
Users (1) ───→ (M) Messages
Users (1) ───→ (M) Notifications

Pets (1) ───→ (M) Bookings
Pets (1) ───→ (M) BreedingRecords

Employees (1) ───→ (M) Bookings
Employees (1) ───→ (M) Reviews

Services (1) ───→ (M) Bookings

Products (1) ───→ (M) Orders (via orderItems)
Products (1) ───→ (M) Reviews

Bookings (1) ───→ (M) Reviews
Bookings (1) ───→ (M) Messages
Bookings (1) ───→ (1) Reminders

Orders (1) ───→ (M) Reviews
```

---

## Performance Optimization Strategies

### 1. Compound Indexes
- `{ userId: 1, status: 1, createdAt: -1 }` for user-specific queries
- `{ serviceType: 1, startDate: 1, status: 1 }` for booking searches
- `{ category: 1, status: 1, rating: -1 }` for product listings

### 2. Caching Strategy
- Cache frequently accessed data (user profiles, active services)
- Use Redis for session management and rate limiting
- Cache geolocation queries with TTL

### 3. Data Archiving
- Archive completed bookings older than 2 years
- Move completed orders to archive collection after 1 year
- Retain active and recent data in main collections

### 4. Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Use aggregation pipelines for complex reports
- Avoid deep population of references

---

This schema design provides a robust foundation for the Dog Care Platform with proper normalization, efficient indexing, and clear relationships between entities.
