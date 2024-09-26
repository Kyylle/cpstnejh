import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileSection.css"; // Import the CSS styles for this section
import ContactInfoModal from "./ContactInfoModal"; // Import the Contact Info Modal
import EditAccountModal from "./EditAccountModal"; // Import the Edit Account Modal
import ProfilePictureModal from "./ProfilePictureModal"; // Import Profile Picture Modal
import BackgroundPictureModal from "./BackgroundPictureModal"; // Import Background Picture Modal

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

  // Fetch company profile data from the backend when the component loads (or page refreshes)
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
      setCompanyData(response.data.updatedEmployer);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle profile picture save
  const handleProfilePictureSave = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file); // Append profile image

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "/api/auth/uploadProfilePicture",
        formData,
        config
      );

      setCompanyData((prevData) => ({
        ...prevData,
        profileImage: response.data.imagePath, // Assuming the backend returns `imagePath`
      }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Handle background picture save
  const handleBackgroundPictureSave = async (file) => {
    const formData = new FormData();
    formData.append("backgroundImage", file); // Append background image

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        "/api/auth/uploadBackgroundPicture",
        formData,
        config
      );

      setCompanyData((prevData) => ({
        ...prevData,
        backgroundImage: response.data.imagePath, // Assuming the backend returns `imagePath`
      }));
    } catch (error) {
      console.error("Error uploading background picture:", error);
    }
  };

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      handleProfilePictureSave(file); // Call the function to save the profile picture
    }
  };

  // Handle form submission for profile updates (excluding images)
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

    updateEmployerProfile(updatedData); // Call the update function
    setIsEditModalOpen(false); // Close the modal after submission
  };

  const handleContactInfoClick = (event) => {
    event.preventDefault();
    setIsContactModalOpen(true);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
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
            
            {/* Add the file input here */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange} // Trigger the file upload
            />
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
        formData={companyData} // Pass the current form data
        handleChange={handleChange} // Pass the handleChange function
        handleSubmit={handleSubmit} // Pass the handleSubmit function
      />

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        handleSave={handleProfilePictureSave} // Pass the function to update the profile picture
      />

      {/* Background Picture Modal */}
      <BackgroundPictureModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        handleSave={handleBackgroundPictureSave} // Pass the function to update the background picture
      />
    </div>
  );
};

export default ProfileSection;
