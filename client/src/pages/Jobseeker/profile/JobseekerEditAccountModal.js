import React, { useState } from 'react';
// import './JobseekerEditAccountModal.css'; // Make sure to style your modal appropriately

const JobseekerEditAccountModal = ({ isOpen, onClose, formData, handleChange, handleSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>Edit Your Profile</h2>
        <form className="modal-content" onSubmit={handleSubmit}>
          {/* Form inputs for jobseeker profile editing */}
          <label>Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <label>Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />

          {/* Optionally, add more fields such as skills, experience, education */}
          {/* Example for skills (could use select/multi-select for real data) */}
          <label>Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="Add skills separated by commas"
            value={formData.skills}
            onChange={handleChange}
          />

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobseekerEditAccountModal;
