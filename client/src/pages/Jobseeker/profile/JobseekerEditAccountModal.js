import React, { useState } from 'react';
import axios from 'axios';
import '../css/JobseekerEditAccountModal.css'; 

const JobseekerEditAccountModal = ({ isOpen, onClose, formData, handleChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put("/api/auth/update/jobseeker", formData, config);

      if (response.data) {
        // Assuming the response contains the updated jobseeker profile
        console.log("Profile updated:", response.data.updatedJobseeker);
        onClose(); // Close modal after success
      }
    } catch (error) {
      console.error("Error updating jobseeker profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="modal-overlay"> 
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>X</button>
=======
    <div className="jobseeker-modal-overlay">
      <div className="jobseeker-modal-container">
        <button className="jobseeker-modal-close-btn" onClick={onClose}>X</button>
>>>>>>> Stashed changes
        <h2>Edit Your Profile</h2>
        <form className="jobseeker-modal-content" onSubmit={handleSubmit}>
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

          <label>Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="Add skills separated by commas"
            value={formData.skills}
            onChange={handleChange}
          />

          <button type="submit" className="jobseeker-save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {error && <p className="jobseeker-error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default JobseekerEditAccountModal;

