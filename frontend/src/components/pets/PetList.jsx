/**
 * PetList Component
 * Displays a list of pets for the logged-in user
 */

import React from 'react';
import PropTypes from 'prop-types';
import PetCard from './PetCard';
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
          <PetCard
            key={pet._id}
            pet={pet}
            onClick={onPetClick}
          />
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
