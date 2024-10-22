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
      setLoading(false);
    } catch (error) {
      setError('Failed to update follow status.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleFollow} disabled={loading}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default FollowButton;
