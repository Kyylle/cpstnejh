import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/postJob.css'; // Ensure the path to the CSS file is correct
import { FiX } from 'react-icons/fi';

const PostJob = () => {
    const [showJobModal, setShowJobModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showPostJobModal, setShowPostJobModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [caption, setCaption] = useState(''); // Caption state
    const [mediaFiles, setMediaFiles] = useState([]); // Media files state
    const [profileImage, setProfileImage] = useState('/path/to/default-profile.png'); // Default profile image

    // Job Posting Modal States
    const [jobTitle, setJobTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jobType, setJobType] = useState('Full-Time');
    const [location, setLocation] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [requirements, setRequirements] = useState('');
    const [responsibilities, setResponsibilities] = useState('');
    const [benefits, setBenefits] = useState('');

    // Fetch employer profile for the profile image
    useEffect(() => {
        const fetchEmployerProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Fetch employer profile
                const response = await axios.get('/api/auth/profile', config);
                const employerData = response.data;

                // Set profile image if exists
                if (employerData.profileImage) {
                    setProfileImage(employerData.profileImage);
                }
            } catch (error) {
                console.error('Error fetching employer profile:', error);
            }
        };

        fetchEmployerProfile();
    }, []);

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
        setShowPostJobModal(false); // Close the job modal as well
    };

    // Handle posting content
    const handleSubmitContent = async () => {
        const formData = new FormData();
        
        // Caption can still be optional
        formData.append('caption', caption);
    
        // Append all media files to the form data, but it's not required anymore
        mediaFiles.forEach((file) => {
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
            alert("Caption Is required");
        }
    };
    

    // Handle posting a job
    const handlePostJobClick = () => {
        setShowPostJobModal(true);
    };

    const handleSubmitJob = async () => {
        if (!jobTitle || !description || !jobType || !location) {
            alert("Please fill in all required fields.");
            return;
        }

        const jobData = {
            jobTitle,
            description,
            jobType,
            location,
            salaryRange,
            applicationDeadline,
            requirements: requirements.split(',').map(item => item.trim()), // Convert comma-separated input to array
            responsibilities: responsibilities.split(',').map(item => item.trim()),
            benefits: benefits.split(',').map(item => item.trim()),
        };

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            // Post job data to the backend
            const response = await axios.post('/api/auth/post-job', jobData, config);

            // Handle success
            console.log('Job posted successfully:', response.data);
            closeModal(); // Close the modal after successful post
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job. Please try again later.');
        }
    };

    return (
        <div className="post-job-container">
            {/* Input Box */}
            <div className="post-job-input">
                <img className="post-job-profile-pic" src={profileImage} alt="Profile" />
                <input type="text" placeholder="Write a post" onClick={handleInputClick} />
                <div className="post-job-action-buttons">
                    <button className="post-job-free-job" onClick={handlePostJobClick}>
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

            {/* Post a Job Modal */}
            {showPostJobModal && (
                <div className="post-job-modal-overlay">
                    <div className="post-job-post-modal">
                        <div className="post-job-post-header">
                            <h2>Post a Job for Free</h2>
                            <button className="post-job-close-modal-btn" onClick={closeModal}>
                                <FiX size={24} />
                            </button>
                        </div>
                        <form className="post-job-form">
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Job Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <select
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                                required
                            >
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Salary Range"
                                value={salaryRange}
                                onChange={(e) => setSalaryRange(e.target.value)}
                            />
                            <input
                                type="date"
                                placeholder="Application Deadline"
                                value={applicationDeadline}
                                onChange={(e) => setApplicationDeadline(e.target.value)}
                            />
                            <textarea
                                placeholder="Requirements (comma separated)"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                            />
                            <textarea
                                placeholder="Responsibilities (comma separated)"
                                value={responsibilities}
                                onChange={(e) => setResponsibilities(e.target.value)}
                            />
                            <textarea
                                placeholder="Benefits (comma separated)"
                                value={benefits}
                                onChange={(e) => setBenefits(e.target.value)}
                            />
                            <button type="button" className="post-job-post-btn" onClick={handleSubmitJob}>
                                Post Job
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJob;
