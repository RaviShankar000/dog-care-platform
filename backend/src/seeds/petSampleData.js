/**
 * Sample Pet Data for Development
 * WARNING: This is for local testing only!
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sample users data
const sampleUsers = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
    phone: '+1234567890',
    address: '123 Main St, New York, NY 10001',
    role: 'USER',
    isVerified: true,
    status: 'active'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password123!',
    phone: '+1234567891',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    role: 'USER',
    isVerified: true,
    status: 'active'
  }
];

// Sample pets data
const samplePets = [
  // John's pets
  {
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    weight: 30,
    owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    vaccinations: [
      {
        vaccineName: 'Rabies',
        dateGiven: new Date('2024-01-15'),
        nextDueDate: new Date('2027-01-15'),
        notes: 'Annual rabies vaccination completed'
      },
      {
        vaccineName: 'DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus)',
        dateGiven: new Date('2024-02-20'),
        nextDueDate: new Date('2027-02-20'),
        notes: 'Core vaccination - no adverse reactions'
      },
      {
        vaccineName: 'Bordetella',
        dateGiven: new Date('2024-06-10'),
        nextDueDate: new Date('2025-06-10'),
        notes: 'Kennel cough prevention'
      }
    ],
    medicalHistory: [
      {
        illness: 'Ear Infection',
        treatment: 'Antibiotic drops and oral medication',
        vetName: 'Dr. Sarah Johnson',
        visitDate: new Date('2023-11-05'),
        notes: 'Bacterial infection cleared after 10-day treatment'
      },
      {
        illness: 'Routine Checkup',
        treatment: 'Physical examination and blood work',
        vetName: 'Dr. Sarah Johnson',
        visitDate: new Date('2024-01-15'),
        notes: 'Healthy, all vitals normal. Recommended dental cleaning next year'
      }
    ]
  },
  {
    name: 'Bella',
    breed: 'Labrador',
    age: 5,
    weight: 28,
    owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    vaccinations: [
      {
        vaccineName: 'Rabies',
        dateGiven: new Date('2023-12-10'),
        nextDueDate: new Date('2026-12-10'),
        notes: '3-year rabies vaccination'
      },
      {
        vaccineName: 'DHPP',
        dateGiven: new Date('2024-01-05'),
        nextDueDate: new Date('2027-01-05'),
        notes: 'Core vaccination complete'
      }
    ],
    medicalHistory: [
      {
        illness: 'Hip Dysplasia',
        treatment: 'Pain management medication and physical therapy',
        vetName: 'Dr. Michael Chen',
        visitDate: new Date('2023-08-20'),
        notes: 'Mild hip dysplasia diagnosed. Started on joint supplements'
      },
      {
        illness: 'Skin Allergy',
        treatment: 'Hypoallergenic diet and antihistamine',
        vetName: 'Dr. Michael Chen',
        visitDate: new Date('2024-03-12'),
        notes: 'Seasonal allergies managed with medication'
      }
    ]
  },
  // Jane's pets
  {
    name: 'Charlie',
    breed: 'German Shepherd',
    age: 2,
    weight: 35,
    owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    vaccinations: [
      {
        vaccineName: 'Rabies',
        dateGiven: new Date('2024-03-01'),
        nextDueDate: new Date('2027-03-01'),
        notes: 'First rabies vaccination'
      },
      {
        vaccineName: 'DHPP',
        dateGiven: new Date('2024-03-01'),
        nextDueDate: new Date('2027-03-01'),
        notes: 'Puppy vaccination series completed'
      },
      {
        vaccineName: 'Leptospirosis',
        dateGiven: new Date('2024-04-15'),
        nextDueDate: new Date('2025-04-15'),
        notes: 'Protection against bacterial infection'
      }
    ],
    medicalHistory: [
      {
        illness: 'Gastroenteritis',
        treatment: 'IV fluids and anti-nausea medication',
        vetName: 'Dr. Emily Rodriguez',
        visitDate: new Date('2024-05-20'),
        notes: 'Ate something inappropriate. Recovered fully after 2 days'
      }
    ]
  },
  {
    name: 'Luna',
    breed: 'Beagle',
    age: 4,
    weight: 12,
    owner: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    vaccinations: [
      {
        vaccineName: 'Rabies',
        dateGiven: new Date('2024-01-20'),
        nextDueDate: new Date('2027-01-20'),
        notes: 'Annual vaccination up to date'
      },
      {
        vaccineName: 'DHPP',
        dateGiven: new Date('2024-02-10'),
        nextDueDate: new Date('2027-02-10'),
        notes: 'Core vaccines complete'
      }
    ],
    medicalHistory: [
      {
        illness: 'Dental Cleaning',
        treatment: 'Professional dental cleaning under anesthesia',
        vetName: 'Dr. Emily Rodriguez',
        visitDate: new Date('2023-10-15'),
        notes: 'Removed tartar buildup. Teeth in good condition'
      },
      {
        illness: 'Obesity Management',
        treatment: 'Diet plan and exercise regimen',
        vetName: 'Dr. Emily Rodriguez',
        visitDate: new Date('2024-02-28'),
        notes: 'Weight loss program started. Target weight: 10kg'
      }
    ]
  }
];

module.exports = { sampleUsers, samplePets };
