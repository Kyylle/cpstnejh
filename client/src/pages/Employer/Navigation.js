import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/navigation.css'; // Import the navigation styles
import ProfileDropdown from './ProfileDropdown'; // Import the ProfileDropdown component

const Navigation = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState(''); // State to hold the company's name
  const [profileImage, setProfileImage] = useState(''); // State to hold the profile image URL
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // Debugging: Check if the token is correctly fetched
        console.log('Token from localStorage:', token);

        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the header
          },
        };

        // Fetch profile data from your backend
        const response = await axios.get('/api/auth/profile', config);
        console.log('Profile data response:', response.data);
        
        // Debugging: Check the response from the backend
        console.log('Profile data response:', response.data);
        
        if (response.data.companyName) {
          setCompanyName(response.data.companyName); // Set the company's name
          setProfileImage(response.data.profileImage || 'https://via.placeholder.com/40'); // Set profile image or default
        } else {
          throw new Error('No profile data found in response');
        }
      } catch (error) {
        // Debugging: Check if the error is related to authorization
        console.error('Error fetching employer profile:', error.response ? error.response.data : error.message);
      }
    };

    fetchEmployerProfile(); // Fetch the employer profile when component loads
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the auth token
    navigate('/'); // Redirect to sign in page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">JobHub</div>
        <input type="text" className="navbar-search-bar" placeholder="Search..." />
      </div>
      <div className="navbar-center">
        <button onClick={() => navigate('/employerdashboard')} className="navbar-button">Home</button>
        <button onClick={() => navigate('/employerinquiries')} className="navbar-button">Inquiries</button>
        <button onClick={() => navigate('/employermessaging')} className="navbar-button">Messaging</button>
        <button onClick={() => navigate('/employernotifications')} className="navbar-button">Notifications</button>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="navbar-user-name">{companyName}</span>
          <div className="profile-circle">
            <img src={profileImage || 'https://via.placeholder.com/40'} alt="Profile" className="profile-avatar" /> {/* Profile Image or default */}
          </div>
        </div>
        {showDropdown && (
          <ProfileDropdown 
            companyName={companyName} 
            profileImage={profileImage}
            handleLogout={handleLogout} 
          />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
