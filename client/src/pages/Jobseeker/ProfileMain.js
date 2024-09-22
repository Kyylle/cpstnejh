import React, { useState } from 'react';
import Navigation from './Navigation';
import './css/profileMain.css';

const ProfileMain = () => {
  const [modalContent, setModalContent] = useState(null);

  const handleEditClick = (content) => {
    setModalContent(content);
    // You can add logic to open a modal here
  };

  const handlePhotoChange = (e) => {
    // Handle profile photo change logic here
  };

  const handleModalOpen = (content) => {
    setModalContent(content);
    // You can add logic to open a modal here
  };

  const handleModalClose = () => {
    setModalContent(null);
    // You can add logic to close a modal here
  };

  return (
    <div className="profile-main-container">
      <Navigation />
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-photo">
            <img src="path-to-default-profile" alt="profile" />
            <input
              type="file"
              accept="image/*"
              className="photo-upload-btn"
              onChange={(e) => handlePhotoChange(e)}
              style={{ display: 'none' }}
            />
            <button className="new-photo-btn" onClick={() => document.querySelector('.photo-upload-btn').click()}>
              New Photo
            </button>
          </div>
          <div className="profile-info">
            <h2>Kyle Khenier Duaglang</h2>
            <p>Argao National High School Region, Philippines</p>
            <a href="#" onClick={() => handleModalOpen('Contact Info')}>Contact Info</a>
          </div>
          <button className="edit-profile-btn" onClick={() => handleModalOpen('Edit Profile')}>✎</button>
        </div>
      </div>
      <div className="main-contents">
        <div className="resume-upload">
          <div className="content-header">
            <h3>Resume</h3>
            <button className="edit-btn" onClick={() => handleEditClick('Edit Resume')}>✎</button>
          </div>
          <input type="file" className="resume-upload-btn" />
        </div>
        <div className="previous-position">
          <div className="content-header">
            <h3>Previous Position</h3>
            <button className="edit-btn" onClick={() => handleEditClick('Edit Previous Position')}>✎</button>
          </div>
          <p>No previous position</p>
        </div>
        <div className="skills">
          <div className="content-header">
            <h3>Skills</h3>
            <button className="plus-btn">+</button>
            <button className="edit-btn" onClick={() => handleEditClick('Edit Skills')}>✎</button>
          </div>
          <p>No skills added</p>
        </div>
        <div className="experience">
          <div className="content-header">
            <h3>Experience</h3>
            <button className="plus-btn">+</button>
            <button className="edit-btn" onClick={() => handleEditClick('Edit Experience')}>✎</button>
          </div>
          <p>No experience added</p>
        </div>
        <div className="education">
          <div className="content-header">
            <h3>Education</h3>
            <button className="plus-btn">+</button>
            <button className="edit-btn" onClick={() => handleEditClick('Edit Education')}>✎</button>
          </div>
          <p>No education added</p>
        </div>
      </div>
      {/* Modal implementation can be added here */}
      {modalContent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>{modalContent}</h2>
            {/* Add your form or content here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMain;
