import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import { FaPhotoVideo } from "react-icons/fa";

const PostJob = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [profileImage, setProfileImage] = useState("/path/to/default-profile.png");

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get("/api/auth/profile", config);
        const employerData = response.data;

        if (employerData.profileImage) {
          setProfileImage(employerData.profileImage);
        }
      } catch (error) {
        console.error("Error fetching employer profile:", error);
      }
    };

    fetchEmployerProfile();
  }, []);

  const handleInputClick = () => setShowJobModal(true);
  const handleMediaClick = () => {
    setShowJobModal(false);
    setShowMediaModal(true);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setMediaFiles([...files]);

    if (files && files.length > 0) {
      setShowMediaModal(false);
      setShowJobModal(true);
    }
  };

  const closeModal = () => {
    setShowJobModal(false);
    setShowMediaModal(false);
  };

  const handleSubmitContent = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    mediaFiles.forEach((file) => formData.append("media", file));

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post("/api/auth/post-contents", formData, config);
      setCaption("");
      setMediaFiles([]);
      closeModal();
    } catch (error) {
      console.error("Error posting content:", error);
    }
  };

  return (
    <div className="post-job-container mx-auto max-w-2xl mb-4">
      {/* Post Input Box */}
      <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={profileImage}
          alt="Profile"
        />
        <input
          type="text"
          placeholder="What's on your mind?"
          onClick={handleInputClick}
          className="ml-4 flex-grow px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="ml-4 p-2 text-blue-500 hover:bg-gray-200 rounded-full transition"
          onClick={handleMediaClick}
        >
          <FaPhotoVideo size={20} />
        </button>
      </div>

      {/* Post Content Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <FiX size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            {mediaFiles.length > 0 && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(mediaFiles[0])}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleMediaClick}
                className="p-2 text-blue-500 hover:bg-gray-200 rounded-full transition"
              >
                <FaPhotoVideo size={20} />
              </button>
              <button
                onClick={handleSubmitContent}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <FiX size={24} />
            </button>
            <h4 className="text-lg font-semibold mb-4">Upload Media</h4>
            <input
              type="file"
              onChange={handleFileUpload}
              multiple
              className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;
