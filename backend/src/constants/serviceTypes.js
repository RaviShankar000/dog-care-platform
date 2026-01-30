/**
 * Service Type Constants
 * Define available service types for bookings
 */

const SERVICE_TYPES = {
  GROOMING: 'GROOMING',
  WALKING: 'WALKING',
  VET: 'VET',
  TRAINING: 'TRAINING',
  BOARDING: 'BOARDING'
};

const VALID_SERVICE_TYPES = Object.values(SERVICE_TYPES);

module.exports = {
  SERVICE_TYPES,
  VALID_SERVICE_TYPES
};
