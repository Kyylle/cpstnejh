import React, { useState } from 'react';
import { uploadFile } from './fileUpload'; // Import the reusable function

const FileUploadModal = ({ isOpen, onClose, uploadEndpoint, fieldName, modalTitle, handleSave }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const response = await uploadFile(selectedFile, uploadEndpoint, fieldName);
        console.log(`${modalTitle} uploaded successfully:`, response);
        handleSave(response); // Update the picture in the parent component
        onClose(); // Close the modal
      } catch (error) {
        console.error(`Error uploading the ${modalTitle.toLowerCase()}:`, error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload {modalTitle}</h2>
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

export default FileUploadModal;
