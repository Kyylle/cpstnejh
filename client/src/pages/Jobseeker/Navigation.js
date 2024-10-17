// Navigation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/navigationJobseeker.css'; // Ensure CSS path is correct
import ProfileDropdown from './ProfiileDropdownJobseeker'; // Import dropdown

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get current route
  const [jobseekerName, setJobseekerName] = useState('Jobseeker');
  const [profileImage, setProfileImage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch jobseeker profile on mount
  useEffect(() => {
    const fetchJobseekerProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) throw new Error('No authentication token found');

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('/api/auth/getJobseekerProfile', config);

        setJobseekerName(response.data.name || 'Jobseeker');
        setProfileImage(response.data.profileImage || 'https://via.placeholder.com/40');
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };

    fetchJobseekerProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // Determine active button based on route
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/')}>JobHub</div>
        <input type="text" className="navbar-search-bar" placeholder="Search..." />
      </div>

      <div className="navbar-center">
        <button
          className={`navbar-button ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Home
        </button>
        <button
          className={`navbar-button ${isActive('/job') ? 'active' : ''}`}
          onClick={() => navigate('/job')}
        >
          Job
        </button>
        <button
          className={`navbar-button ${isActive('/messaging') ? 'active' : ''}`}
          onClick={() => navigate('/messaging')}
        >
          Messaging
        </button>
        <button
          className={`navbar-button ${isActive('/notifications') ? 'active' : ''}`}
          onClick={() => navigate('/notifications')}
        >
          Notifications
        </button>
      </div>

      <div className="navbar-right">
        <div className="navbar-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="navbar-user-name">{jobseekerName}</span>
          <div className="profile-circle">
            <img src={profileImage} alt="Profile" className="profile-avatar" />
          </div>
        </div>
        {showDropdown && (
          <ProfileDropdown
            jobseekerName={jobseekerName}
            profileImage={profileImage}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </nav>
  );
};

export default Navigation;



