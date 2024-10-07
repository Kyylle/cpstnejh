import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/navigationJobseeker.css'; // Import jobseeker navigation styles
import ProfileDropdownJobseeker from './ProfiileDropdownJobseeker'; // Jobseeker dropdown component

const NavigationJobseeker = () => {
  const navigate = useNavigate();
  const [jobseekerName, setJobseekerName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchJobseekerProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        };

        // Fetch jobseeker profile from the backend
        const response = await axios.get('/api/auth/getJobseekerProfile', config);

        if (response.data.name) {
          setJobseekerName(response.data.name); // Set jobseeker name
          setProfileImage(response.data.profileImage || 'https://via.placeholder.com/40'); // Set profile image or default
        } else {
          throw new Error('No profile data found in response');
        }
      } catch (error) {
        console.error('Error fetching jobseeker profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchJobseekerProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/'); // Redirect to sign-in page
  };

  return (
    <nav className="navbar-jobseeker">
      <div className="navbar-left-jobseeker">
        <div className="logo-jobseeker">JobHub</div>
        <input type="text" className="navbar-search-bar-jobseeker" placeholder="Search..." />
      </div>
      <div className="navbar-center-jobseeker">
        <button onClick={() => navigate('/dashboard')} className="navbar-button-jobseeker">Home</button>
        <button onClick={() => navigate('/job')} className="navbar-button-jobseeker">Job</button>
        <button onClick={() => navigate('/messaging')} className="navbar-button-jobseeker">Messaging</button>
        <button onClick={() => navigate('/notifications')} className="navbar-button-jobseeker">Notifications</button>
      </div>
      <div className="navbar-right-jobseeker">
        <div className="navbar-profile-jobseeker" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="navbar-user-name-jobseeker">{jobseekerName}</span>
          <div className="profile-circle-jobseeker">
            <img src={profileImage} alt="Profile" className="profile-avatar-jobseeker" />
          </div>
        </div>
        {showDropdown && (
          <ProfileDropdownJobseeker
            jobseekerName={jobseekerName}
            profileImage={profileImage}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </nav>
  );
};

export default NavigationJobseeker;
