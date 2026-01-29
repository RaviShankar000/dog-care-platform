/**
 * PetList Component
 * Displays a list of pets for the logged-in user
 */

import React from 'react';
import PropTypes from 'prop-types';
import './PetList.css';

const PetList = ({ pets, onPetClick, onAddPet }) => {
  // Empty state handling
  if (pets.length === 0) {
    return (
      <div className="pet-list-container">
        <h2 className="pet-list-title">My Pets</h2>
        
        <div className="empty-state">
          <div className="empty-state-icon">🐾</div>
          <h3 className="empty-state-title">No Pets Yet</h3>
          <p className="empty-state-message">
            You haven't added any pets to your account yet. Start by adding your first furry friend!
          </p>
          {onAddPet && (
            <button className="add-pet-button" onClick={onAddPet}>
              Add Your First Pet
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pet-list-container">
      <h2 className="pet-list-title">My Pets</h2>
      
      <div className="pet-list-grid">
        {pets.map((pet) => (
          <div
            key={pet._id}
            className="pet-card"
            onClick={() => onPetClick(pet._id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onPetClick(pet._id);
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
        ))}
      </div>
    </div>
  );
};

PetList.propTypes = {
  pets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      breed: PropTypes.string,
      age: PropTypes.number,
      weight: PropTypes.number,
      vaccinations: PropTypes.array,
      medicalHistory: PropTypes.array
    })
  ).isRequired,
  onPetClick: PropTypes.func.isRequired,
  onAddPet: PropTypes.func
};

export default PetList;
