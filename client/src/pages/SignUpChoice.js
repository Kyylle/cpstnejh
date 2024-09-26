import React from 'react';
import './SignUpChoice.css'; // Ensure unique CSS file
import { FiX } from 'react-icons/fi';

const SignUpChoice = ({ showModal, onClose, openEmployerSignUp, openJobseekerSignUp }) => { // Accept openEmployerSignUp prop

  if (!showModal) return null; // Don't render if modal is closed

  return (
    <div className="unique-modal-overlay">
      <div className="unique-signup-modal-container">
      <button className="close-button" onClick={onClose}>
        <FiX size={24} />
        </button>
        <div className="unique-signup-choice-content">
          <h2 className="unique-signup-title">Sign Up As?</h2>
          
          <div className="unique-signup-choice-buttons">
            <div className="unique-signup-option">
              <p>Are you looking for employees?</p>
              <button
                onClick={openEmployerSignUp} // Use openEmployerSignUp to transition to Employer signup
                className="unique-signup-button"
              >
                Employer
              </button>
            </div>

            <div className="unique-signup-option">
              <p>Are you looking for jobs?</p>
              <button
                onClick={openJobseekerSignUp}
                className="unique-signup-button"
              >
                Jobseeker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpChoice;
