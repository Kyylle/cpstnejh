import React, { useState } from 'react';
import axios from 'axios';
import './css/postJob.css'; // Add necessary styles
import { FiX } from 'react-icons/fi';

const PostJob = () => {
    const [showJobModal, setShowJobModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [caption, setCaption] = useState(''); // Caption state
    const [mediaFiles, setMediaFiles] = useState([]); // Media files state

    const handleInputClick = () => {
        setShowJobModal(true); // Open post modal
    };

    const handleMediaClick = () => {
        setShowJobModal(false); // Close post modal and open media modal
        setShowMediaModal(true);
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;
        setMediaFiles([...files]); // Save media files to state

        // Preview the first image
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // Preview the first image
                setShowMediaModal(false); // Close media modal
                setShowJobModal(true); // Reopen post modal with image preview
            };
            reader.readAsDataURL(file);
        }
    };

    const closeModal = () => {
        setShowJobModal(false);
        setShowMediaModal(false);
    };

    const handleSubmitContent = async () => {
        if (!caption && mediaFiles.length === 0) {
            alert("Please add a caption or media before posting.");
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption);

        // Append all media files to the form data
        mediaFiles.forEach((file, index) => {
            formData.append('media', file);
        });

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            // Send the post request to the backend
            const response = await axios.post('/api/auth/post-contents', formData, config);

            // Handle the response from the backend
            console.log('Content posted successfully:', response.data);
            closeModal(); // Close the modal after successful post
        } catch (error) {
            console.error("Error posting content:", error);
            alert("Failed to post content. Please try again later.");
        }
    };

    return (
        <div className="post-job-container">
            {/* Input Box */}
            <div className="post-job-input">
                <img className="post-job-profile-pic" src="/path/to/default-profile.png" alt="Profile" />
                <input type="text" placeholder="Write a post" onClick={handleInputClick} />
                <div className="post-job-action-buttons">
                    <button className="post-job-free-job" onClick={handleInputClick}>
                        <span role="img" aria-label="briefcase">💼</span> Post a free job
                    </button>
                    <button className="post-job-media" onClick={handleMediaClick}>
                        <span role="img" aria-label="media">🖼️</span> Media
                    </button>
                </div>
            </div>

            {/* Post a Content Modal */}
            {showJobModal && (
                <div className="post-job-modal-overlay">
                    <div className="post-job-post-modal">
                        <div className="post-job-post-header">
                            <h2>Create a Post</h2>
                            <button className="post-job-close-modal-btn" onClick={closeModal}>
                                <FiX size={24} />
                            </button>
                        </div>
                        <textarea 
                            placeholder="What do you want to talk about?" 
                            value={caption} 
                            onChange={(e) => setCaption(e.target.value)} // Capture caption
                        />

                        {/* Image Preview */}
                        {previewImage && (
                            <div className="post-job-image-preview">
                                <img src={previewImage} alt="Preview" />
                            </div>
                        )}

                        <div className="post-job-modal-actions">
                            <button onClick={handleMediaClick}>
                                <img src="/path/to/media-icon.png" alt="Media" />
                            </button>
                            <button className="post-job-post-btn" onClick={handleSubmitContent}>Post</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Upload Modal */}
            {showMediaModal && (
                <div className="post-job-modal-overlay">
                    <div className="post-job-media-modal">
                        <h4>Select files to begin</h4>
                        <button className="post-job-upload-btn">
                            <input type="file" onChange={handleFileUpload} multiple />
                            Upload from computer
                        </button>
                        <button className="post-job-close-modal-btn" onClick={closeModal}>
                            <FiX size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJob;
