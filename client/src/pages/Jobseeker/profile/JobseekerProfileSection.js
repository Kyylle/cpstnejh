import React, { useState, useEffect } from "react";
import { getJobseekerProfile, updateJobseekerProfile } from "./jobseekerService";
import JobseekerEditAccount from "./JobseekerEditAccountModal";
import ChangeProfilePictureModal from "./ChangeProfilePictureModal";
import ChangeBackgroundPictureModal from "./ChangeBackgroundPictureModal";
import '../css/jobseekerProfileSection.css';

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

  return (
    <div className="js-profile-section-container">
      {/* Background and Profile Image Display */}
      <div className="js-profile-cover">
        <img
          src={jobseekerData.backgroundImage || "https://via.placeholder.com/1200x300"}
          alt="Background"
          className="js-background-photo"
        />
        <button className="js-edit-btn" onClick={() => setIsBackgroundModalOpen(true)}>
          Change Background
        </button>
      </div>

      <div className="js-profile-picture-container">
        <img
          src={jobseekerData.profileImage || "https://via.placeholder.com/150"}
          alt="Profile"
          className="js-profile-picture"
        />
        <button className="js-edit-btn" onClick={() => setIsProfileModalOpen(true)}>
          Change Profile Photo
        </button>
      </div>

      {/* Display Jobseeker Information */}
      <div className="js-information">
        <h2 className="js-profile-name">{jobseekerData.name || "Your Name"}</h2>
        <p className="js-profile-bio">{jobseekerData.bio || "Your Bio"}</p>
        <p className="js-profile-location"><i className="fas fa-map-marker-alt"></i> {jobseekerData.location || "Your Location"}</p>
        <p className="js-profile-email"><i className="fas fa-envelope"></i> {jobseekerData.email || "Your Email"}</p>
        <button className="js-edit-btn" onClick={() => setIsEditModalOpen(true)}>
          Edit Profile
        </button>
      </div>

      {/* Modals for Editing and Uploading */}
      <JobseekerEditAccount
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={jobseekerData}
        handleChange={(e) => setJobseekerData({ ...jobseekerData, [e.target.name]: e.target.value })}
      />

      <ChangeProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        setProfileImage={(imagePath) => setJobseekerData({
          ...jobseekerData,
          profileImage: imagePath
        })}
      />

      <ChangeBackgroundPictureModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        setBackgroundImage={(imagePath) => setJobseekerData({
          ...jobseekerData,
          backgroundImage: imagePath
        })}
      />
    </div>
  );
};

export default JobseekerProfileSection;
