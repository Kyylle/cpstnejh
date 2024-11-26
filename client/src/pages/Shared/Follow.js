import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ followId, followModel }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFollow = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = isFollowing
        ? await axios.post('/api/auth/unfollow', { followId, followModel }, config)
        : await axios.post('/api/auth/follow', { followId, followModel }, config);

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      setError('Failed to update follow status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="follow-button-container">
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`follow-button ${isFollowing ? 'following' : 'not-following'} ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FollowButton;
