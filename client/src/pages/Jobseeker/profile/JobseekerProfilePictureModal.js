import React, { useState, useEffect } from 'react';
import { getJobseekerImages, uploadProfileImage } from './jobseekerService';

const JobseekerProfilePicture = () => {
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const images = await getJobseekerImages(token);
        setProfileImage(images.profileImage);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const token = localStorage.getItem("authToken");
      const response = await uploadProfileImage(formData, token);
      setProfileImage(response.imagePath); // Update the profile image with the new uploaded image
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Error uploading profile image");
    }
  };

  return (
    <div className='js-profile-picture-container'>
      <img
        src={profileImage || 'https://via.placeholder.com/150'}
        alt="Profile"
        className="js-profile-picture"
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Profile Picture</button>
    </div>
  );
};

export default JobseekerProfilePicture;
