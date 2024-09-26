import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureModal = ({ isOpen, onClose, handleSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
  
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };
        
        // Update the URL to point to the backend server, likely running on port 5000
        const response = await axios.put('/api/auth/uploadProfilePicture', formData, config);
  
        console.log('Profile picture uploaded successfully:', response.data);
        handleSave(response.data); // Update the profile picture in the parent component
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error uploading the profile picture:', error);
      }
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Profile Picture</h2>
        <input type="file" onChange={handleFileChange} />
        <div className="photo-options">
          <button className="modal-btn" onClick={handleFileUpload}>
            Upload
          </button>
        </div>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
