import React from 'react';
import Navigation from './Navigation';
import './css/EmployerProfileSettings.css'; // CSS for layout
import ProfileSection from './profile/ProfileSection';

const EmployerProfileSettings = () => {
  return (
    <div className="employer-profile-container">
        <div className='employer-settings-navbar'>
      <Navigation />
      </div>
      <div className='employer-settings-profile-section'>
      <ProfileSection/>
      </div>
      
    </div>
  );
};

export default EmployerProfileSettings;
