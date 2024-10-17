import React, { useState } from 'react';
import { uploadBackgroundImage } from './jobseekerService';

const ChangeBackgroundPictureModal = ({ isOpen, onClose, setBackgroundImage }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(''); // Clear any previous errors
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('backgroundImage', file);

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await uploadBackgroundImage(formData, token);
      setBackgroundImage(response.imagePath); // Update the parent component's state
      onClose(); // Close modal after successful upload
    } catch (error) {
      setError('Failed to upload background image. Please try again.');
      console.error('Error uploading background image:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Change Background Picture</h2>
        <input type="file" onChange={handleFileChange} />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ChangeBackgroundPictureModal;
