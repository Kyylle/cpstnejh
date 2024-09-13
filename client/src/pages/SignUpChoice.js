import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import './css/SignUpChoice.css';

const SignUpChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-choice-container">
      <h2>Sign Up as</h2>
      <div className="signup-choice-buttons">
        <button
          onClick={() => navigate('/signup/jobseeker')}
          className="signup-button"
        >
          <FontAwesomeIcon icon={faUser} className="icon" /> Jobseeker
        </button>
        <button
          onClick={() => navigate('/signup/employer')}
          className="signup-button"
        >
          <FontAwesomeIcon icon={faBuilding} className="icon" /> Employer
        </button>
      </div>
    </div>
  );
};

export default SignUpChoice;
