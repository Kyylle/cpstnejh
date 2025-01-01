import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserFriends, FaBriefcase, FaBookmark, FaUsers } from "react-icons/fa"; // Add more icons as needed
import { MdOutlineEventNote } from "react-icons/md";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState({
    companyName: "",
    profileImage: "",
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
        const { companyName, profileImage } = response.data;

        setCompanyData({
          companyName,
          profileImage,
        });
      } catch (error) {
        console.error("Error fetching company profile data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className="overflow-hidden p-4">
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src={companyData.profileImage || "default-profile.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <h3 className="ml-3 text-lg font-semibold text-gray-800">
          {companyData.companyName || "Company Name"}
        </h3>
      </div>

      {/* Navigation Links */}
      <div className="space-y-4">
        {/* Pages */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaBriefcase className="w-6 h-6 text-blue-500" />
          <span className="ml-3 text-gray-700">Pages</span>
        </div>

        {/* Groups */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaUsers className="w-6 h-6 text-green-500" />
          <span className="ml-3 text-gray-700">Groups</span>
        </div>

        {/* Events */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <MdOutlineEventNote className="w-6 h-6 text-yellow-500" />
          <span className="ml-3 text-gray-700">Events</span>
        </div>

        {/* Saved */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaBookmark className="w-6 h-6 text-purple-500" />
          <span className="ml-3 text-gray-700">Saved</span>
        </div>

        {/* Friends */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaUserFriends className="w-6 h-6 text-orange-500" />
          <span className="ml-3 text-gray-700">Friends</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
