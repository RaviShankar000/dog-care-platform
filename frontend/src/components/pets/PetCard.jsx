/**
 * PetCard Component
 * Reusable card component for displaying pet information
 */

import React from 'react';
import PropTypes from 'prop-types';
import './PetCard.css';

const PetCard = ({ pet, onClick }) => {
  return (
    <div
      className="pet-card"
      onClick={() => onClick(pet._id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(pet._id);
        }
      }}
    >
      <div className="pet-card-header">
        <h3 className="pet-name">{pet.name}</h3>
        {pet.breed && <span className="pet-breed">{pet.breed}</span>}
      </div>

      <div className="pet-card-body">
        <div className="pet-info">
          {pet.age && (
            <div className="pet-info-item">
              <span className="info-label">Age:</span>
              <span className="info-value">{pet.age} years</span>
            </div>
          )}
          
          {pet.weight && (
            <div className="pet-info-item">
              <span className="info-label">Weight:</span>
              <span className="info-value">{pet.weight} kg</span>
            </div>
          )}
        </div>

        {pet.vaccinations && pet.vaccinations.length > 0 && (
          <div className="pet-stats">
            <span className="stat-badge">
              {pet.vaccinations.length} Vaccination{pet.vaccinations.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {pet.medicalHistory && pet.medicalHistory.length > 0 && (
          <div className="pet-stats">
            <span className="stat-badge">
              {pet.medicalHistory.length} Medical Record{pet.medicalHistory.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="pet-card-footer">
        <span className="view-profile-link">View Profile →</span>
      </div>
    </div>
  );
};

PetCard.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    breed: PropTypes.string,
    age: PropTypes.number,
    weight: PropTypes.number,
    vaccinations: PropTypes.array,
    medicalHistory: PropTypes.array
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default PetCard;
