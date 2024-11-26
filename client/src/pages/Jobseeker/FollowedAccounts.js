import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/followedAccounts.css';

const FollowedAccounts = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState({}); // Track follow status for each profile

  useEffect(() => {
    // Fetch profiles and follow statuses from the backend
    const fetchProfiles = async () => {
      try {
        const profilesResponse = await axios.get('/api/auth/getallprofiles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        setProfiles(profilesResponse.data);

        // Fetch the follow status for all profiles
        const followStatusResponse = await axios.get('/api/auth/getfollowstatuses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        // Populate followStatus object
        const statusMap = {};
        followStatusResponse.data.forEach(({ followingId }) => {
          statusMap[followingId] = true; // Mark as followed
        });

        setFollowStatus(statusMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profiles or follow statuses:', error);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleFollow = async (profileId, profileModel) => {
    try {
      const response = await axios.post(
        '/api/auth/follow',
        { followId: profileId, followModel: profileModel },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      if (response.status === 200) {
        // Update follow status
        setFollowStatus((prevState) => ({
          ...prevState,
          [profileId]: true
        }));
      }
    } catch (error) {
      console.error('Error following account:', error.response ? error.response.data : error);
    }
  };

  const handleUnfollow = async (profileId, profileModel) => {
    try {
      const response = await axios.post(
        '/api/auth/unfollow',
        { followId: profileId, followModel: profileModel },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      if (response.status === 200) {
        // Update follow status
        setFollowStatus((prevState) => ({
          ...prevState,
          [profileId]: false
        }));
      }
    } catch (error) {
      console.error('Error unfollowing account:', error.response ? error.response.data : error);
    }
  };

  const checkFollowStatus = (profileId) => followStatus[profileId] || false;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (profiles.length === 0) {
    return <div>No profiles found.</div>;
  }

  return (
    <div className="followed-accounts-container">
      <h3>Add to your feed</h3>
      {profiles.map((profile, index) => {
        const isFollowing = checkFollowStatus(profile._id);
        const profileModel = profile.type === 'employer' ? 'Employer' : 'Jobseeker';

        return (
          <div key={index} className="account">
            <img
              src={profile.profileImage || 'https://via.placeholder.com/50'}
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
              <button
                className="follow-button"
                onClick={() =>
                  isFollowing
                    ? handleUnfollow(profile._id, profileModel)
                    : handleFollow(profile._id, profileModel)
                }
              >
                {isFollowing ? 'Unfollow' : '+ Follow'}
              </button>
            </div>
          </div>
        );
      })}
      <div className="view-more">
        <a href="#">View all recommendations →</a>
      </div>
    </div>
  );
};

export default FollowedAccounts;
