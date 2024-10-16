import React, { useState } from 'react';
import { uploadFile } from './fileUpload'; // Import the reusable function

const BackgroundPictureModal = ({ isOpen, onClose, handleSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const response = await uploadFile(selectedFile, '/api/auth/uploadBackgroundPicture', 'backgroundImage');
        console.log('Background picture uploaded successfully:', response);
        handleSave(response); // Update the background picture in the parent component
        onClose(); // Close the modal
      } catch (error) {
        console.error('Error uploading the background picture:', error);
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
