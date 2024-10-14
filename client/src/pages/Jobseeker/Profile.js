import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/profile.css'; // Ensure you have a CSS file to style the component accordingly

const Profile = () => {
  const [profile, setProfile] = useState(null); // State to hold jobseeker profile data
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch jobseeker profile data when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage

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
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  if (!profile) {
    return <div>Profile data not available</div>; // Show message if profile data is not found
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* Background Image */}
        <div className="background-image-container">
          <img
            src={profile.backgroundImage || 'https://via.placeholder.com/150'}
            alt="Background"
            className="background-image"
          />
        </div>

        {/* Profile Image */}
        <div className="profile-picture-container">
          <img
            src={profile.profileImage || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="profile-picture"
          />
        </div>

        {/* Name */}
        <h2>{profile.name || 'Name not available'}</h2>
      </div>

      {/* Education Section */}
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

      {/* Saved Items Section (Example of another section if needed) */}
      <div className="profile-section">
        <h4>Saved Items</h4>
        <p>No saved items</p>
      </div>

      {/* Example of additional sections */}
      <div className="profile-section">
        <p>Groups</p>
        <p>Events</p>
        <p>Followed Hashtags</p>
      </div>
    </div>
  );
};

export default Profile;
