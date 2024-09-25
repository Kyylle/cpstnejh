import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileSection.css"; // Import the CSS styles for this section
import ContactInfoModal from "./ContactInfoModal"; // Import the Contact Info Modal
import EditAccountModal from "./EditAccountModal"; // Import the Edit Account Modal

const ProfileSection = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    pronouns: "",
    headline: "",
    location: "",
    email: "",
    website: "",
    industry: "",
  });

  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // For Contact Info Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For Edit Account Modal

  // Fetch company profile data from the backend when the component loads (or page refreshes)
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        
        };
  
  
        const response = await axios.get('/api/auth/profile', config);
        console.log('Fetched company data:', response.data);  // Check the data here
  
        // Destructure and update state
        const { companyName, location, email, website, pronouns, headline, industry } = response.data;
  
        setCompanyData({
          companyName,
          location,
          email,
          website,
          pronouns,
          headline,
          industry,
        });
      } catch (error) {
        console.error('Error fetching company profile data:', error);
      }
    };
  
    fetchCompanyData();
  }, []);
  

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update employer profile function
  const updateEmployerProfile = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "/api/auth/updateprofile",
        formData,
        config
      );
      console.log("Profile updated:", response.data);
      // Update the state with the saved data
      setCompanyData(response.data.updatedEmployer);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = () => {
    const updatedData = {
      ...companyData,
      companyName: companyData.companyName || "",
      pronouns: companyData.pronouns || "",
      headline: companyData.headline || "",
      industry: companyData.industry || "",
      location: companyData.location || "",
      email: companyData.email || "",
      website: companyData.website || "",
    };

    console.log("Form data being sent:", updatedData);
    updateEmployerProfile(updatedData); // Call the update function
    setIsEditModalOpen(false); // Close the modal after submission
  };

  // Handle save to refetch the updated data
  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get("/api/auth/profile", config);
      const {
        companyName,
        location,
        email,
        website,
        pronouns,
        headline,
        industry,
      } = response.data;

      setCompanyData({
        companyName,
        location,
        email,
        website,
        pronouns,
        headline,
        industry,
      });
    } catch (error) {
      console.error("Error fetching updated company data:", error);
    }
  };

  const handleContactInfoClick = (event) => {
    event.preventDefault();
    setIsContactModalOpen(true);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="ps-profile-section-container">
      {/* Background Cover */}
      <div className="ps-profile-cover">
        <img
          src="https://via.placeholder.com/1200x300"
          alt="Cover"
          className="ps-cover-photo"
        />
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

          {/* Edit Icon */}
          <div className="ps-edit-icon">
            <button className="edit-btn" onClick={handleEditClick}>
              <img
                src="https://img.icons8.com/material-outlined/24/000000/edit--v1.png"
                alt="Edit"
              />
            </button>
          </div>

          {/* Company Information */}
          <div className="ps-company-info">
            <h1>{companyData.companyName || "Company Name"}</h1>
            <p className="ps-profile-title">{companyData.headline || ""}</p>
            <p className="ps-location">
              {companyData.location || "No location"} •{" "}
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
      </div>

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        companyName={companyData.companyName}
        profileUrl={companyData.profileUrl}
        email={companyData.email}
        location={companyData.location}
      />

      {/* Edit Info Modal */}
      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        formData={companyData} // Pass the current form data
        handleChange={handleChange} // Pass the handleChange function
        handleSubmit={handleSubmit} // Pass the handleSubmit function
      />
    </div>
  );
};

export default ProfileSection;
