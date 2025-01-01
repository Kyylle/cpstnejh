import React, { useEffect, useState } from "react";
import axios from "axios";
import './css/companyAnalytics.css'; // Import the new CSS file

const CompanyAnalytics = () => {
  const [profiles, setProfiles] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch profiles and follow status
  const fetchProfilesAndStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch all profiles (both employers and jobseekers)
      const response = await axios.get("/api/auth/getallprofiles", config);
      const profilesData = response.data;

      if (profilesData.length === 0) {
        setErrorMessage("No profiles available at this time.");
      } else {
        setProfiles(profilesData);
      }

      // Fetch follow statuses
      const followStatusResponses = await Promise.all(
        profilesData.map((profile) => {
          const followModel = profile.type === "employer" ? "Employer" : "Jobseeker";
          const targetId = profile._id;

          return axios
            .get(`/api/auth/following-status?followModel=${followModel}&targetId=${targetId}`, config)
            .then((response) => ({
              id: targetId,
              isFollowing: response.data.isFollowing,
            }))
            .catch((error) => {
              console.error("Error fetching follow status for profile:", profile, error);
              return null;
            });
        })
      );

      const statusMap = {};
      followStatusResponses.forEach((result) => {
        if (result) {
          statusMap[result.id] = result.isFollowing;
        }
      });

      setFollowStatus(statusMap);
    } catch (error) {
      console.error("Error fetching profiles or follow statuses:", error);
      setErrorMessage("Failed to load profiles. Please try again later.");
    }
    setLoading(false);
  };

  // Handle follow/unfollow actions
  const handleFollowUnfollow = async (profileId, profileModel, isFollowing) => {
    const endpoint = isFollowing ? "/api/auth/unfollow" : "/api/auth/follow";
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        endpoint,
        { followModel: profileModel, followingId: profileId },
        config
      );

      if (response.status === 200) {
        setFollowStatus((prevState) => ({
          ...prevState,
          [profileId]: !isFollowing, // Toggle follow status
        }));
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? "unfollowing" : "following"} account:`, error);
    }
  };

  const checkFollowStatus = (profileId) => followStatus[profileId] || false;

  useEffect(() => {
    fetchProfilesAndStatus();
  }, []);

  return (
    <div className="custom-followed-accounts-container">
      <h3 className="custom-h3">Add to your feed</h3>

      {loading && <div>Loading...</div>}

      {errorMessage && (
        <p className="custom-error-message">{errorMessage}</p>
      )}

      {!errorMessage && profiles.length > 0 && (
        <div className="custom-profiles-container">
          {profiles.map((profile, index) => {
            const isFollowing = checkFollowStatus(profile._id);
            const profileModel = profile.type === "employer" ? "Employer" : "Jobseeker";

            return (
              <div key={index} className="custom-account">
                <img
                  src={
                    profile.type === "employer" || "jobseeker"
                      ? profile.profileImage
                      : profile.jobseekerProfileImage || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt={`${profile.type === "employer" ? profile.companyName : profile.name}'s profile`}
                  className="custom-account-logo"
                />
                <div className="custom-account-info">
                  <h4 className="custom-account-name">
                    {profile.type === "employer" ? profile.companyName : profile.name}
                  </h4>
                  <p className="custom-account-description">
                    {profile.type === "employer"
                      ? `${profile.location} | ${profile.industry}`
                      : `${profile.experience} | ${profile.skills.length > 0 ? profile.skills.join(", ") : "No skills"}`}
                  </p>
                  <div className="custom-follow-button-container">
                    <button
                      className={`custom-follow-button ${isFollowing ? "following" : "not-following"}`}
                      onClick={() => handleFollowUnfollow(profile._id, profileModel, isFollowing)}
                    >
                      {isFollowing ? "Unfollow" : "+ Follow"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="custom-view-more">
        <a href="#">View all recommendations →</a>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
