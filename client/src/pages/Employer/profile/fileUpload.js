// fileUpload.js
import axios from 'axios';
import './FileUploadModal.css';


// Reusable file upload function
export const uploadFile = async (file, endpoint, fieldName) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(endpoint, formData, config);
    return response.data;
  } catch (error) {
    console.error(`Error uploading ${fieldName}:`, error);
    throw error;
  }
};
