import { useState } from 'react';
import axios from 'axios';

const useFollow = (initialIsFollowing = false) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFollow = async (followId, followModel) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Determine endpoint and payload based on current state
      const endpoint = isFollowing ? '/api/auth/unfollow' : '/api/auth/follow';
      const response = await axios.post(endpoint, {
        followId, // Using the passed followId
        followModel: followModel === 'employer' ? 'Employer' : 'Jobseeker' // Correct model mapping
      }, config);

      // Update follow status based on the API response
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error updating follow status:', err);
      setError(err.response?.data?.message || 'Failed to update follow status.');
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    loading,
    error,
    handleFollow,
  };
};

export default useFollow;
