import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditAccountModal.css'; // Import your custom styles

const EditAccountModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    pronouns: '',
    headline: '',
    location: {
      country: '',
      city: '',
    },
    email: '',
    website: '',
    industry: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        location: initialData.location || { country: '', city: '' }, // Ensure location is always an object
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value,
      },
    }));
  };

  const updateEmployerProfile = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put('/updateprofile', formData, config);
      console.log('Profile updated:', response.data);
      // Optionally call onSave to update parent component data
      onSave(response.data.updatedEmployer); // Assuming the updated data is returned
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSubmit = () => {
    updateEmployerProfile(formData); // Call the update function
    onClose(); // Close the modal
  };

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
            name="country"
            placeholder="Country/Region"
            value={formData.location.country}
            onChange={handleLocationChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.location.city}
            onChange={handleLocationChange}
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
