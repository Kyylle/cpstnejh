    import React, { useState } from 'react';
    import axios from 'axios';
    import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

    export const JobModal = () => {
        const [step, setStep] = useState(1);

        // Step 1 - Job Information State
        const [jobTitle, setJobTitle] = useState('');
        const [description, setDescription] = useState('');
        const [jobType, setJobType] = useState('Full-Time');
        const [location, setLocation] = useState('');

        // Step 2 - Additional Info State
        const [salaryRange, setSalaryRange] = useState('');
        const [applicationDeadline, setApplicationDeadline] = useState('');

        // Step 3 - Job Details State
        const [requirements, setRequirements] = useState('');
        const [responsibilities, setResponsibilities] = useState('');
        const [benefits, setBenefits] = useState('');

        // Error Handling State
        const [errorMessage, setErrorMessage] = useState('');

        // Modal visibility state
        const [isModalOpen, setIsModalOpen] = useState(true);
        

        const handleSubmitJob = async () => {
            if (!jobTitle || !description || !jobType || !location) {
                setErrorMessage('Please fill in all required fields.');
                return;
            }

            const jobData = {
                jobTitle,
                description,
                jobType,
                location,
                salaryRange,
                applicationDeadline,
                requirements: requirements.split(',').map((item) => item.trim()),
                responsibilities: responsibilities.split(',').map((item) => item.trim()),
                benefits: benefits.split(',').map((item) => item.trim()),
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
                alert('Job posted successfully!');
                setStep(1); // Reset to the first step after successful submission
                setErrorMessage(''); // Clear error message
            } catch (error) {
                console.error('Error posting job:', error);
                setErrorMessage('Failed to post job. Please try again later.');
            }
        };

        const handleNext = () => {
            if (step === 1) {
                if (!jobTitle || !description || !location) {
                    setErrorMessage('Please fill in all required fields for job details.');
                    return;
                }
                setStep(2); // Move to next step
                setErrorMessage(''); // Clear error message
            } else if (step === 2) {
                setStep(3); // Move to final step
                setErrorMessage(''); // Clear error message
            }
        };

        const handleBack = () => {
            if (step === 3) {
                setStep(2); // Go back to previous step
            } else if (step === 2) {
                setStep(1); // Go back to first step
            }
        };

        const handleCloseErrorMessage = () => {
            setErrorMessage(''); // Close the error message
        };

        const handleCloseModal = () => {
            setIsModalOpen(false); 
        };

        if (!isModalOpen) {
            return null; // Return nothing if modal is closed
        }

        return (
            <div>
                <div className="post-job-modal-overlay flex justify-center items-center fixed inset-0 bg-gray-900 bg-opacity-50">
                    <div className="post-job-modal bg-white p-8 rounded-lg w-1/2 relative">
                        {/* Modal Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 text-lg"
                        >
                            <FaTimes />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

                        {/* Error Message inside Modal */}
                        {errorMessage && (
                            <div className="bg-yellow-500 text-white text-sm flex items-center justify-between p-3 mb-4 rounded-lg shadow-lg">
                                <div className="flex items-center">
                                    <FaExclamationTriangle className="mr-2" />
                                    <span>{errorMessage}</span>
                                </div>
                                <button
                                    onClick={handleCloseErrorMessage}
                                    className="text-lg font-semibold"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}

                        {/* Step 1 - Job Information */}
                        {step === 1 && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        id="jobTitle"
                                        placeholder="Enter job title"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                                    <textarea
                                        id="description"
                                        placeholder="Enter job description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
                                    <select
                                        id="jobType"
                                        value={jobType}
                                        onChange={(e) => setJobType(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        placeholder="Enter location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2 - Additional Info */}
                        {step === 2 && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">Salary Range</label>
                                    <input
                                        type="text"
                                        id="salaryRange"
                                        placeholder="Enter salary range"
                                        value={salaryRange}
                                        onChange={(e) => setSalaryRange(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">Application Deadline</label>
                                    <input
                                        type="date"
                                        id="applicationDeadline"
                                        value={applicationDeadline}
                                        onChange={(e) => setApplicationDeadline(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3 - Job Details */}
                        {step === 3 && (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements</label>
                                    <input
                                        type="text"
                                        id="requirements"
                                        placeholder="Enter job requirements (comma separated)"
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">Responsibilities</label>
                                    <input
                                        type="text"
                                        id="responsibilities"
                                        placeholder="Enter job responsibilities (comma separated)"
                                        value={responsibilities}
                                        onChange={(e) => setResponsibilities(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Benefits</label>
                                    <input
                                        type="text"
                                        id="benefits"
                                        placeholder="Enter job benefits (comma separated)"
                                        value={benefits}
                                        onChange={(e) => setBenefits(e.target.value)}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                                >
                                    Back
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    onClick={handleNext}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitJob}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                >
                                    Submit Job
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
