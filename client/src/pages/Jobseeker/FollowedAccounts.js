import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/followedAccounts.css'; // Ensure you have the right CSS file for styling

const FollowedAccounts = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profiles from the backend
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/auth/getallprofiles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // assuming you store the token in localStorage
          }
        });
        setProfiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (profiles.length === 0) {
    return <div>No profiles found.</div>;
  }

  return (
    <div className="followed-accounts-container">
      <h3>Add to your feed</h3>
      {/* Dynamic list of profiles */}
      {profiles.map((profile, index) => (
        <div key={index} className="account">
          <img
            src={profile.profileImage || "https://via.placeholder.com/50"}
            alt={profile.type === 'employer' ? profile.companyName : profile.name}
            className="account-logo"
          />
          <div className="account-info">
            <h4>{profile.type === 'employer' ? profile.companyName : profile.name}</h4>
            <p>
              {profile.type === 'employer' 
                ? `${profile.industry} | ${profile.location}` 
                : `${profile.skills.join(', ')} | ${profile.experience}`}
            </p>
            <button className="follow-button">+ Follow</button>
          </div>
        </div>
      ))}
      {/* Option to view more recommendations */}
      <div className="view-more">
        <a href="#">View all recommendations →</a>
      </div>
    </div>
  );
};

export default FollowedAccounts;
