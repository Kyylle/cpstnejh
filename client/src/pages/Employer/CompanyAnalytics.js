import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/companyAnalytics.css";

const CompanyAnalytics = () => {
  const [profiles, setProfiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch all profiles (both employers and jobseekers)
        const response = await axios.get("/api/auth/getallprofiles", config); // Adjust the endpoint to match your backend
        const profilesData = response.data;

        if (profilesData.length === 0) {
          setErrorMessage("No profiles available at this time.");
        } else {
          setProfiles(profilesData);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setErrorMessage("Failed to load profiles. Please try again later.");
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="company-analytics-container">
      <div className="company-analytics-header">
        <h4>Add to your feed</h4>
        <i className="info-icon">i</i>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!errorMessage && profiles.length > 0 && (
        <div className="company-analytics-recommendations-list">
          {profiles.map((profile, index) => (
            <div key={index} className="company-analytics-recommendation-item">
              <img
                src={
                  profile.type === "employer"
                    ? profile.profileImage
                    : profile.jobseekerProfileImage || "/default-profile.png"
                }
                alt={`${
                  profile.type === "employer"
                    ? profile.companyName
                    : profile.name
                }'s profile`}
                className="company-analytics-profile-image"
              />
              <div className="company-analytics-profile-details">
                {profile.type === "employer" ? (
                  <>
                    <p className="company-analytics-profile-name">
                      {profile.companyName}
                    </p>
                    <p className="company-analytics-profile-description">
                      {profile.location} &bull; {profile.industry}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="company-analytics-profile-name">
                      {profile.name}
                    </p>
                    <p className="company-analytics-profile-description">
                      {profile.experience}
                      &bull;
                      {profile.skills.length > 0
                        ? profile.skills.join(", ")
                        : "No skills"}
                    </p>
                  </>
                )}
              </div>
              <button className="company-analytics-follow-btn">+ Follow</button>
            </div>
          ))}
        </div>
      )}
      <div className="company-analytics-view-more">
        <a href="#">View all recommendations →</a>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
