import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileDropdown from "./ProfileDropdown";
import { FaBriefcase } from "react-icons/fa"; // Icon for "Post a free job"
import { MdMenu, MdClose } from "react-icons/md"; // Hamburger and close icons
import { JobModal } from "./JobModal"; // Import JobModal

const Navigation = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Company Name");
  const [profileImage, setProfileImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false); // State for Job Modal
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile menu visibility

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("/api/auth/profile", config);

        setCompanyName(response.data.companyName || "Company Name");
        setProfileImage(
          response.data.profileImage || "https://via.placeholder.com/40"
        );
      } catch (error) {
        console.error("Error fetching employer profile:", error.message);
      }
    };

    fetchEmployerProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleJobModalToggle = () => {
    setShowJobModal(prevState => !prevState); // Toggle modal visibility
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(prevState => !prevState); // Toggle mobile menu
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo and Search Bar */}
        <div className="flex items-center gap-4">
          <div
            className="text-xl font-bold text-blue-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            JobHub
          </div>
          <input
            type="text"
            className="hidden sm:block w-64 md:w-80 lg:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
            placeholder="Search for jobs, companies..."
          />
        </div>

        {/* Burger Icon on Small Screens */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-700">
            {showMobileMenu ? (
              <MdClose size={30} />
            ) : (
              <MdMenu size={30} />
            )}
          </button>
        </div>

        {/* Navigation Links for Larger Screens */}
        <div className="hidden sm:flex gap-4">
          <button
            onClick={() => navigate("/employerdashboard")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/employerinquiries")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Inquiries
          </button>
          <button
            onClick={() => navigate("/employermessaging")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Messaging
          </button>
          <button
            onClick={() => navigate("/employernotifications")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Notifications
          </button>
        </div>

        {/* Profile and Job Modal Section */}
        <div className="flex items-center gap-4">
          {/* Post a Free Job Button */}
          <button
            onClick={handleJobModalToggle} // Toggle the modal visibility
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <FaBriefcase size={20} /> {/* Briefcase icon */}
            <span className="text-sm">Post a free job</span>
          </button>

          {/* Company Name and Profile */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">
              {companyName}
            </span>
            <img
              src={profileImage || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="sm:hidden flex flex-col gap-4 p-4 bg-white border-t border-gray-200 shadow-md">
          <button
            onClick={() => navigate("/employerdashboard")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/employerinquiries")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Inquiries
          </button>
          <button
            onClick={() => navigate("/employermessaging")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Messaging
          </button>
          <button
            onClick={() => navigate("/employernotifications")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Notifications
          </button>
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && <JobModal />}

      {/* Profile Dropdown */}
      {showDropdown && (
        <ProfileDropdown
          companyName={companyName}
          profileImage={profileImage}
          handleLogout={handleLogout}
        />
      )}
    </nav>
  );
};

export default Navigation;
