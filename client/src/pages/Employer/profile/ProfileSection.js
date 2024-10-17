import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileSection.css"; // Import the CSS styles for this section
import ContactInfoModal from "./ContactInfoModal"; // Import the Contact Info Modal
import EditAccountModal from "./EditAccountModal"; // Import the Edit Account Modal
import FileUploadModal from "./FileUploadModal"; // Reusable file upload modal

const ProfileSection = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    pronouns: "",
    headline: "",
    location: "",
    email: "",
    website: "",
    industry: "",
    profileImage: "", // For profile picture URL
    backgroundImage: "", // For background picture URL
  });

  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // For Contact Info Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For Edit Account Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // For Profile Picture Modal
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false); // For Background Picture Modal

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get("/api/auth/profile", config);
        const {
          companyName,
          location,
          email,
          website,
          pronouns,
          headline,
          industry,
          profileImage,
          backgroundImage,
        } = response.data;

        setCompanyData({
          companyName,
          location,
          email,
          website,
          pronouns,
          headline,
          industry,
          profileImage, // Set the profile image URL from the server
          backgroundImage, // Set the background image URL from the server
        });
      } catch (error) {
        console.error("Error fetching company profile data:", error);
      }
    };

    fetchCompanyData();
  }, []);

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
      setCompanyData(response.data.updatedEmployer);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSaveProfileImage = (data) => {
    setCompanyData((prevData) => ({
      ...prevData,
      profileImage: data.imagePath,
    }));
  };

  const handleSaveBackgroundImage = (data) => {
    setCompanyData((prevData) => ({
      ...prevData,
      backgroundImage: data.imagePath,
    }));
  };

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

    updateEmployerProfile(updatedData);
    setIsEditModalOpen(false);
  };

  return (
    <div className="ps-profile-section-container">
      {/* Background Cover */}
      <div className="ps-profile-cover">
        <img
          src={
            companyData.backgroundImage ||
            "https://via.placeholder.com/1200x300"
          }
          alt="Cover"
          className="ps-cover-photo"
        />
        <button
          className="ps-change-cover-btn"
          onClick={() => setIsBackgroundModalOpen(true)}
        >
          <img src="https://img.icons8.com/camera" alt="Change Cover" />
        </button>
      </div>

      {/* Profile Details */}
      <div className="ps-profile-details-container">
        <div className="ps-profile-info">
          <div className="ps-profile-picture-container">
            <img
              src={
                companyData.profileImage
                  ? `http://localhost:5000${companyData.profileImage}`
                  : "https://img.icons8.com/camera"
              }
              alt="Profile"
              className="ps-profile-picture"
            />
            <button
              className="ps-change-photo-btn"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <img src="https://img.icons8.com/camera" alt="Change Photo" />
            </button>
          </div>

          {/* Edit Icon */}
          <div className="ps-edit-icon">
            <button
              className="edit-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              <img
                src="https://img.icons8.com/material-outlined/24/000000/edit--v1.png"
                alt="Edit"
              />
            </button>
          </div>

          {/* Company Information */}
          <div className="ps-company-info">
            <h2>{companyData.companyName || "Company Name"}</h2>
            <p className="ps-profile-title">{companyData.headline || ""}</p>
            <p className="ps-location">
              {companyData.location || "No location"} •{" "}
              <a href="#" onClick={() => setIsContactModalOpen(true)}>
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
        onClose={() => setIsContactModalOpen(false)}
        companyName={companyData.companyName}
        profileUrl={companyData.profileUrl}
        email={companyData.email}
        location={companyData.location}
      />

      {/* Edit Info Modal */}
      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={companyData}
        handleChange={(e) =>
          setCompanyData({ ...companyData, [e.target.name]: e.target.value })
        }
        handleSubmit={handleSubmit}
      />

      {/* Profile Picture Modal */}
      <FileUploadModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        uploadEndpoint="/api/auth/uploadProfilePicture" // Correct the port here if needed
        fieldName="profileImage"
        modalTitle="Profile Picture"
        handleSave={handleSaveProfileImage}
      />

      {/* Background Picture Modal */}
      <FileUploadModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        uploadEndpoint="/api/auth/uploadBackgroundPicture"
        fieldName="backgroundImage"
        modalTitle="Background Picture"
        handleSave={handleSaveBackgroundImage}
      />
    </div>
  );
};

export default ProfileSection;
