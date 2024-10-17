import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/profile.css'; 

const Profile = () => {
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken'); 

        if (!token) {
          console.error('Token not found in localStorage');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/getJobseekerProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchProfile();
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!profile) {
    return <div>Profile data not available</div>; 
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        
        <div className="background-image-container">
          <img
            src={profile.backgroundImage || 'https://via.placeholder.com/150'}
            alt="Background"
            className="background-image"
          />
        </div>

        
        <div className="profile-picture-container">
          <img
            src={profile.profileImage || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="profile-picture"
          />
        </div>

        
        <h2>{profile.name || 'Name not available'}</h2>
      </div>

      
      <div className="profile-section">
        <h4>Education</h4>
        {profile.education.length > 0 ? (
          <ul>
            {profile.education.map((edu, index) => (
              <li key={index}>
                {edu.degree} at {edu.school}, {edu.startYear} - {edu.endYear || 'Present'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No education details available</p>
        )}
      </div>

      
      <div className="profile-section">
        <h4>Saved Items</h4>
        <p>No saved items</p>
      </div>

      
      <div className="profile-section">
        <p>Groups</p>
        <p>Events</p>
        <p>Followed Hashtags</p>
      </div>
    </div>
  );
};

export default Profile;
