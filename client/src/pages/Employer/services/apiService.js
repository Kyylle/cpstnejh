import axios from 'axios';

// Function to get the token dynamically inside each request
const getConfig = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all posts (feeds)
export const fetchFeeds = async () => {
  const config = getConfig();
  return axios.get('/api/auth/get-posts', config);
};

// Like a post
export const likePost = async (postId) => {
  const config = getConfig();
  return axios.post('/api/auth/like-post', { postId }, config);
};

// Comment on a post
export const commentPost = async (postId, comment) => {
  const config = getConfig(); // Ensure your config has the correct token and headers
  return axios.post('/api/auth/comment-post', { postId, comment }, config);
};

// Fetch a commenter's profile image and name
export const fetchCommenterProfileImage = async (userId, userType) => {
  const config = getConfig();
  const response = await axios.get(`/api/auth/commenter-profile/${userId}/${userType}`, config);

  return {
    profileImage: response.data.profileImage || "/default-profile.png",
    name: response.data.name || "Anonymous",
  };
};
