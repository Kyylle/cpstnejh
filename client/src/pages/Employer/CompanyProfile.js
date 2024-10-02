import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/companyProfile.css";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    profileImage: "",
    backgroundImage: "",
  });

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
        const { companyName, industry, profileImage, backgroundImage } =
          response.data;

        setCompanyData({
          companyName,
          industry,
          profileImage,
          backgroundImage,
        });
      } catch (error) {
        console.error("Error fetching company profile data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className="left-profile-container">
      {/* Background Image */}
      <div className="left-profile-background">
        <img
          src={companyData.backgroundImage || "default-background.png"}
          alt="Background"
          className="left-background-image"
        />
      </div>

      {/* Profile Image and Details */}
      <div className="left-profile-section">
        <img
          src={companyData.profileImage || "default-profile.png"}
          alt="Profile"
          className="left-profile-picture"
        />
        <h3 className="left-company-name">
          {companyData.companyName || "Company Name"}
        </h3>
        <p className="left-industry">{companyData.industry || "Industry"}</p>
      </div>

      <div className="left-saved-items">
        <h4>Saved Items</h4>
        {/* Placeholder for saved items */}
        <p>No saved items</p>
      </div>

      <div className="left-profile-links">
        <a href="/">Groups</a>
        <a href="/">Events</a>
        <a href="/">Followed Hashtags</a>
      </div>
    </div>
  );
};

export default CompanyProfile;
