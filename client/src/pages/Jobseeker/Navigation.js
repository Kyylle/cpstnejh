import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProfileDropdown from "./ProfiileDropdownJobseeker"; // Import dropdown
import { MdMenu, MdClose } from "react-icons/md"; // Hamburger and close icons
import Search from "./Search";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobseekerName, setJobseekerName] = useState("Jobseeker");
  const [profileImage, setProfileImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile menu visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchJobseekerProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get("/api/auth/getJobseekerProfile", config);

        setJobseekerName(response.data.name || "Jobseeker");
        setProfileImage(response.data.profileImage || "https://via.placeholder.com/40");
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchJobseekerProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setShowMobileMenu(prevState => !prevState); // Toggle mobile menu
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearch(e.target.value.trim().length > 0); // Show Search component only if there's input
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false); // Hide inline search results if navigating
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 mb-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo and Search Bar */}
        <div className="flex items-center gap-4">
          <div
            className="text-xl font-bold text-blue-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            JobHub
          </div>
          <div className="relative">
            <input
              type="text"
              className="hidden sm:block w-64 md:w-80 lg:w-96 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
              placeholder="Search for jobs, companies..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
            {/* Conditionally render the Search component */}
            {showSearch && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 p-4 z-50">
                <Search query={searchQuery} />
              </div>
            )}
          </div>
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
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition ${
              isActive("/dashboard") ? "bg-blue-100" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/job")}
            className={`px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition ${
              isActive("/job") ? "bg-blue-100" : ""
            }`}
          >
            Job Listings
          </button>
          
          <button
            onClick={() => navigate("/messaging")}
            className={`px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition ${
              isActive("/messaging") ? "bg-blue-100" : ""
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className={`px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition ${
              isActive("/notifications") ? "bg-blue-100" : ""
            }`}
          >
            Notifications
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          {/* Jobseeker Name and Profile */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:block">
              {jobseekerName}
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
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/job")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Job Listings
          </button>
          <button
            onClick={() => navigate("/applications")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            My Applications
          </button>
          <button
            onClick={() => navigate("/messaging")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Messages
          </button>
          <button
            onClick={() => navigate("/notifications")}
            className="px-4 py-2 rounded-full font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Notifications
          </button>
        </div>
      )}

      {/* Profile Dropdown */}
      {showDropdown && (
        <ProfileDropdown
          jobseekerName={jobseekerName}
          profileImage={profileImage}
          handleLogout={handleLogout}
        />
      )}
    </nav>
  );
};

export default Navigation;
