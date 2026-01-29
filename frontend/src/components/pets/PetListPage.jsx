/**
 * Example usage of PetList component
 */

import React, { useState, useEffect } from 'react';
import PetList from './PetList';

const PetListPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pets from API
    fetchUserPets();
  }, []);

  const fetchUserPets = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/pets', {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`
      //   }
      // });
      // const data = await response.json();
      // setPets(data.data.pets);

      // Mock data for demonstration
      setPets([
        {
          _id: '1',
          name: 'Max',
          breed: 'Golden Retriever',
          age: 3,
          weight: 30,
          vaccinations: [
            { vaccineName: 'Rabies', dateGiven: '2024-01-15' }
          ],
          medicalHistory: [
            { illness: 'Ear Infection', visitDate: '2023-11-05' }
          ]
        },
        {
          _id: '2',
          name: 'Bella',
          breed: 'Labrador',
          age: 5,
          weight: 28,
          vaccinations: [
            { vaccineName: 'Rabies', dateGiven: '2023-12-10' }
          ],
          medicalHistory: []
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setLoading(false);
    }
  };

  const handlePetClick = (petId) => {
    // Navigate to pet profile page
    console.log('Navigating to pet profile:', petId);
    // TODO: Implement navigation
    // navigate(`/pets/${petId}`);
  };

  const handleAddPet = () => {
    // Navigate to add pet form
    console.log('Navigating to add pet form');
    // TODO: Implement navigation
    // navigate('/pets/new');
  };

  if (loading) {
    return <div>Loading pets...</div>;
  }

  return (
    <PetList 
      pets={pets} 
      onPetClick={handlePetClick}
      onAddPet={handleAddPet}
    />
  );
};

export default PetListPage;
