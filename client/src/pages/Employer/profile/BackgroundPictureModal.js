import React, { useState } from 'react';
import axios from 'axios';

const BackgroundPictureModal = ({ isOpen, onClose, handleSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('backgroundImage', selectedFile);

      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };

        // Send a POST request to the backend to upload the file
        const response = await axios.post('/api/auth/uploadBackgroundPicture', formData, config);

        console.log('Background image uploaded successfully:', response.data);
        handleSave(response.data); // Call handleSave with the URL of the uploaded background image
        onClose();
      } catch (error) {
        console.error('Error uploading the background image:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Background Picture</h2>
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

export default BackgroundPictureModal;
