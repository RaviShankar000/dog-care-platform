/**
 * PetDetailsSection Component
 * Reusable section component for displaying pet detail information
 */

import React from 'react';
import PropTypes from 'prop-types';
import './PetDetailsSection.css';

const PetDetailsSection = ({ title, children, icon }) => {
  return (
    <div className="pet-details-section">
      <div className="section-header">
        {icon && <span className="section-icon">{icon}</span>}
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

PetDetailsSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string
};

export default PetDetailsSection;
