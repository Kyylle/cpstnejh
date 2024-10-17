import React, { useState, useEffect } from "react";
import { getJobseekerProfile, updateJobseekerProfile, uploadProfileImage } from "./jobseekerService";
import JobseekerEditAccount from "./JobseekerEditAccountModal"; // This modal will handle profile edits
import FileUploadModal from "./JobseekerFileUploadModal"; // Reusable file upload modal for images

const JobseekerProfileSection = () => {
  const [jobseekerData, setJobseekerData] = useState({
    name: "",
    bio: "",
    location: "",
    email: "",
    website: "",
    skills: [],
    education: [],
    experience: [],
    profileImage: "",
    backgroundImage: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const profileData = await getJobseekerProfile(token);
        setJobseekerData(profileData);
      } catch (error) {
        console.error("Error fetching jobseeker profile data:", error);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedData = await updateJobseekerProfile(formData, token);
      setJobseekerData(updatedData.updatedJobseeker);
    } catch (error) {
      console.error("Error updating jobseeker profile:", error);
    }
  };

  const handleSaveImage = async (data, field) => {
    setJobseekerData((prevData) => ({
      ...prevData,
      [field]: data.imagePath,
    }));
  };

  return (
    <div className="js-profile-section-container">
      {/* Background and Profile Image Display */}
      <div className="js-profile-cover">
        <img
          src={jobseekerData.backgroundImage || "https://via.placeholder.com/1200x300"}
          alt="Background"
          className="js-background-photo"
        />
        <button onClick={() => setIsBackgroundModalOpen(true)}>Change Background</button>
      </div>

      <div className="js-profile-picture-container">
        <img
          src={jobseekerData.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="js-profile-picture"
        />
        <button onClick={() => setIsProfileModalOpen(true)}>Change Profile Photo</button>
      </div>

      {/* Display Jobseeker Information */}
      <div className="js-information">
        <h2>{jobseekerData.name || "Your Name"}</h2>
        <p>{jobseekerData.bio || "Your Bio"}</p>
        <p>{jobseekerData.location || "Your Location"}</p>
        <p>{jobseekerData.email || "Your Email"}</p>
        <button onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
      </div>

      {/* Modals for Editing and Uploading */}
      <JobseekerEditAccount
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={jobseekerData}
        handleChange={(e) => setJobseekerData({ ...jobseekerData, [e.target.name]: e.target.value })}
      />

      <FileUploadModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        uploadEndpoint="/profile-picture"
        fieldName="profileImage"
        modalTitle="Profile Picture"
        handleSave={(data) => handleSaveImage(data, 'profileImage')}
      />

      <FileUploadModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        uploadEndpoint="/backgroundprofile"
        fieldName="backgroundImage"
        modalTitle="Background Picture"
        handleSave={(data) => handleSaveImage(data, 'backgroundImage')}
      />
    </div>
  );
};

export default JobseekerProfileSection;
