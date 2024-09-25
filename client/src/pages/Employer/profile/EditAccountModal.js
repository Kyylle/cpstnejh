import React from 'react';
import './EditAccountModal.css'; // Import your custom styles

const EditAccountModal = ({ isOpen, onClose, formData, handleChange, handleSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>Edit Intro</h2>
        <div className="modal-content">
          {/* Company Name */}
          <label>Company Name*</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />

          {/* Pronouns */}
          <label>Pronouns</label>
          <select name="pronouns" value={formData.pronouns} onChange={handleChange}>
            <option value="">Please select</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
          </select>

          {/* Headline */}
          <label>Headline*</label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
          />

          {/* Industry */}
          <label>Industry</label>
          <input
            type="text"
            name="industry"
            placeholder="Ex: Sales"
            value={formData.industry}
            onChange={handleChange}
          />

          {/* Location */}
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="City, Country"
            value={formData.location}
            onChange={handleChange}
          />

          {/* Contact Info */}
          <label>Contact info</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Website */}
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />

          <button className="save-btn" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
