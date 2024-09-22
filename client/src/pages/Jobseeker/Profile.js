import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/profile.css'; // Profile component styling

const Profile = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch user data when the component loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem('email');
        
        if (!email) {
          console.error('Email not found in localStorage');
          setLoading(false);
          return;
        }

        console.log('Fetching user for email:', email); // Debugging line

        const response = await axios.get('/api/auth/get', {
          params: { email },
        });

        console.log('User data fetched:', response.data); // Debugging line
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchUser();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>ATAy...</div>; // Show loading message while fetching
  }

  if (!user) {
    return <div>Atay wa ghpn</div>; // Show message if user data is not found
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture-container">
          <img
            src={user.profilePicture || "default-profile-picture-url"}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <h2>{user.name || "Name not available"}</h2> {/* Display user name */}
        <p>{user.jobTitle || "Job Title / Occupation"}</p>
      </div>

      <div className="profile-section">
        <h4>Connections</h4>
        <p>Connect with alumni</p>
      </div>

      <div className="profile-section">
        <p>Strengthen your profile with an AI writing assistant</p>
        <button className="premium-button">Try Premium for PHP0</button>
      </div>

      <div className="profile-section">
        <p className="saved-items">
          <i className="icon-saved"></i> Saved items
        </p>
      </div>
    </div>
  );
};

export default Profile;
