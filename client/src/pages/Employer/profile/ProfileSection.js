import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileSection.css'; // Import the CSS styles for this section
import ContactInfoModal from './ContactInfoModal'; // Import the Contact Info Modal
import EditAccountModal from './EditAccountModal'; // Import the Edit Account Modal

const ProfileSection = () => {
  const [companyData, setCompanyData] = useState({
    companyName: '',
    location: '',
    contactInfo: '',
    profileUrl: '', // Initially empty, will be fetched
    email: '', // Initially empty, will be fetched
    location: '',
  });

  // State to control visibility of modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // For Contact Info Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For Edit Account Modal

  // Fetch company profile data when the component loads
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming auth token is stored here
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header if needed
          },
        };

        // Make the API request to get company profile data
        const response = await axios.get('/api/auth/profile', config); // Replace with your actual API endpoint
        const { companyName, location, contactInfo, email, profileUrl } = response.data;

        // Set the company data in the state
        setCompanyData({
          companyName,
          location,
          contactInfo,
          email,
          profileUrl,
        });
      } catch (error) {
        console.error('Error fetching company profile data:', error);
      }
    };

    fetchCompanyData();
  }, []);

  const handleContactInfoClick = (event) => {
    event.preventDefault(); // Prevent the default link behavior (page refresh)
    setIsContactModalOpen(true); // Open the Contact Info Modal
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true); // Open the Edit Account Modal
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false); // Close the Contact Info Modal
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // Close the Edit Account Modal
  };

  const handleSave = (updatedData) => {
    // Save the updated data (you can send it to the backend if necessary)
    setCompanyData(updatedData);
  };

  return (
    <div className="ps-profile-section-container">
      {/* Background Cover */}
      <div className="ps-profile-cover">
        <img src="https://via.placeholder.com/1200x300" alt="Cover" className="ps-cover-photo" />
        <button className="ps-change-cover-btn">
          <img src="https://img.icons8.com/camera" alt="Change Cover" />
        </button>
      </div>

      {/* Profile Details */}
      <div className="ps-profile-details-container">
        <div className="ps-profile-info">
          <div className="ps-profile-picture-container">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="ps-profile-picture"
            />
            <button className="ps-change-photo-btn">
              <img src="https://img.icons8.com/camera" alt="Change Photo" />
            </button>
          </div>

          {/* Edit Icon (on the right side) */}
          <div className="ps-edit-icon">
            <button className="edit-btn" onClick={handleEditClick}>
              <img src="https://img.icons8.com/material-outlined/24/000000/edit--v1.png" alt="Edit" />
            </button>
          </div>

          {/* Company Information Next to Profile Picture */}
          <div className="ps-company-info">
            <h1>{companyData.companyName || 'Company Name'}</h1>
            <p className="ps-profile-title"></p>
            <p className="ps-location">
              {companyData.location || 'No location'} •{' '}
              <a href="/" onClick={handleContactInfoClick}>
                Contact info
              </a>
            </p>
          </div>
        </div>

        <div className="ps-profile-actions">
          <button className="ps-blue-btn">Add profile section</button>
          <button className="ps-blue-btn">Enhance profile</button>
          <button className="ps-more-btn">More</button>
        </div>

        <div className="ps-open-to-work">
          <p>
            <strong>Open to work</strong> Junior Developer roles
            <a href="/" className="ps-show-details">
              Show details
            </a>
          </p>
        </div>
      </div>

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={isContactModalOpen} // Separate state for Contact Modal
        onClose={handleCloseContactModal}
        companyName={companyData.companyName}
        profileUrl={companyData.profileUrl}
        email={companyData.email}
        location={companyData.location}
      />

      {/* Edit Info Modal */}
      <EditAccountModal
        isOpen={isEditModalOpen} // Separate state for Edit Modal
        onClose={handleCloseEditModal}
        initialData={companyData}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProfileSection;
