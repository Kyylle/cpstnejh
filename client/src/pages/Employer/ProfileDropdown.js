import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profileDropdown.css'; // Add any styles needed for the dropdown

const ProfileDropdown = ({ companyName, profileImage, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <div className="profile-info">
          <div className="profile-name-icon">
          <img 
            src={profileImage || 'https://via.placeholder.com/40'} // Default image if no profile image
            alt="Profile Icon" 
            className="profile-icon" 
          />
          <strong>{companyName}</strong> {/* Company name */}
          </div>
          <button 
            className="view-profile-btn" 
            onClick={() => navigate('/employerprofilesettings')}
          >
            View Profile
          </button> {/* View Profile button below the company name */}
        </div>
      </div>
      <hr />
      <div className="dropdown-section">
        <h4>Account</h4>
        <ul>
          <li>1 month of Premium for FREE</li>
          <li onClick={() => navigate('/employerprofilesettings')}>Settings & Privacy</li>
          <li>Help</li>
          <li>Language</li>
        </ul>
      </div>
      <hr />
      <div className="dropdown-section">
        <h4>Manage</h4>
        <ul>
          <li>Posts & Activity</li>
        </ul>
      </div>
      <hr />
      <div className="dropdown-footer">
        <button className="sign-out-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
