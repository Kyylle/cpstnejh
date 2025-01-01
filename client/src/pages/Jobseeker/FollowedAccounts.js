import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/followedAccounts.css';

const FollowedAccounts = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState({});

  // Fetch all profiles and followed statuses
  const fetchProfilesAndStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      // Fetch profiles
      const profilesResponse = await axios.get('/api/auth/getallprofiles', config);
      console.log('Profiles Response:', profilesResponse.data);
      setProfiles(profilesResponse.data);
  
      // Fetch follow statuses concurrently
      const followStatusResponses = await Promise.all(
        profilesResponse.data.map((profile) => {
          const followModel = profile.type === 'employer' ? 'Employer' : 'Jobseeker';
          const targetId = profile._id;
  
          if (!targetId) {
            console.error('Missing targetId for profile:', profile);
            return null;
          }
  
          return axios
            .get(`/api/auth/following-status?followModel=${followModel}&targetId=${targetId}`, config)
            .then((response) => ({ id: targetId, isFollowing: response.data.isFollowing }))
            .catch((error) => {
              console.error('Error fetching follow status for profile:', profile, error);
              return null;
            });
        })
      );
  
      // Update followStatus state
      const statusMap = {};
      followStatusResponses.forEach((result) => {
        if (result) {
          statusMap[result.id] = result.isFollowing;
        }
      });
  
      setFollowStatus(statusMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profiles or follow statuses:', error);
      setLoading(false);
    }
  };
  
  

  // Handle follow/unfollow actions
  const handleFollowUnfollow = async (profileId, profileModel, isFollowing) => {
    const endpoint = isFollowing ? '/api/auth/unfollow' : '/api/auth/follow';
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        endpoint,
        { followModel: profileModel, followingId: profileId },
        config
      );

      if (response.status === 200) {
        setFollowStatus((prevState) => ({
          ...prevState,
          [profileId]: !isFollowing, // Toggle follow status
        }));
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} account:`, error);
    }
  };

  const checkFollowStatus = (profileId) => followStatus[profileId] || false;

  useEffect(() => {
    fetchProfilesAndStatus();
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
                  handleFollowUnfollow(profile._id, profileModel, isFollowing)
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
