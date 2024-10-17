import axios from 'axios';

const API_URL = '/api/auth'; // Base URL for your auth API

// Get Jobseeker Profile
export const getJobseekerProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/getJobseekerProfile`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobseeker profile data:', error);
    throw error;
  }
};

// Update Jobseeker Profile
export const updateJobseekerProfile = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${API_URL}/update/jobseeker`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating jobseeker profile:', error);
    throw error;
  }
};

// Upload Jobseeker Profile Image
export const uploadProfileImage = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${API_URL}/jobseeker/upload/profile-picture`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Upload Jobseeker Background Image
export const uploadBackgroundImage = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${API_URL}/jobseeker/upload/backgroundprofile`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading background image:', error);
    throw error;
  }
};

// Get Profile and Background Images
export const getJobseekerImages = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/jobseeker/images`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobseeker images:', error);
    throw error;
  }
};
