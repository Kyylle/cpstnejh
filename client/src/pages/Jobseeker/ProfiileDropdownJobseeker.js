import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/profileDropdownJobseeker.css'; // Add styles specific for jobseeker dropdown

const ProfileDropdownJobseeker = ({ jobseekerName, profileImage, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="jobseeker-profile-dropdown">
      <div className="dropdown-header-jobseeker">
        <div className="profile-info-jobseeker">
          <img
            src={profileImage || 'https://via.placeholder.com/40'}
            alt="Profile Icon"
            className="profile-icon-jobseeker"
          />
          <strong>{jobseekerName}</strong> {/* Jobseeker name */}
        </div>
        <button
          className="view-profile-btn-jobseeker"
          onClick={() => navigate('/jobseekerprofilesettings')}
        >
          View Profile
        </button>
      </div>
      <hr />
      <div className="dropdown-section-jobseeker">
        <h4>Account</h4>
        <ul>
          <li>1 month of Premium for FREE</li>
          <li onClick={() => navigate('/jobseekerprofilesettings')}>Settings & Privacy</li>
          <li>Help</li>
          <li>Language</li>
        </ul>
      </div>
      <hr />
      <div className="dropdown-section-jobseeker">
        <h4>Manage</h4>
        <ul>
          <li>Posts & Activity</li>
        </ul>
      </div>
      <hr />
      <div className="dropdown-footer-jobseeker">
        <button className="sign-out-btn-jobseeker" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdownJobseeker;
