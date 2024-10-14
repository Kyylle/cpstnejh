import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import axios from 'axios';
import './css/job.css'; // Ensure CSS is linked

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // State to store selected job
  const [error, setError] = useState(null);

  // Fetch job listings from the backend API
  useEffect(() => {
    axios.get('/api/auth/jobs') // Updated to use the correct route
      .then((response) => {
        setJobs(response.data.jobs); // Assuming response contains 'jobs' array
      })
      .catch((err) => {
        setError('Failed to fetch job listings.');
      });
  }, []);

  // Handle job selection to show full details on the right sidebar
  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="job-container">
      <Navigation />

      <div className="job-layout">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="profile-summary">
            <img src="path-to-profile-image" alt="profile" />
            <h3>Your Name</h3>
            <p>Your Title or Role</p>
          </div>
          <div className="filter-section">
            <h4>Filter by</h4>
            {/* Add your filter options here */}
            <p>Location</p>
            <p>Company</p>
            <p>Date Posted</p>
          </div>
        </aside>

        {/* Main Job Listings */}
        <main className="job-listings">
          {jobs.map((job) => (
            <div className="job-listing-item" key={job._id}>
              <div>
                <button 
                  className="job-title-btn" 
                  onClick={() => handleJobSelect(job)}
                >
                  {job.jobTitle}
                </button>
                <p>{job.employer?.companyName} • {job.location} • {job.jobType}</p> {/* Updated to display companyName */}
              </div>
            </div>
          ))}
        </main>

        {/* Right Sidebar for job details */}
        <aside className="job-right-sidebar">
          {selectedJob ? (
            <div className="job-details">
              <h4>{selectedJob.jobTitle}</h4>
              <p><strong>Company:</strong> {selectedJob.employer?.companyName}</p> {/* Updated to display companyName */}
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <button>Apply Now</button>
            </div>
          ) : (
            <p>Select a job to view details.</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Job;
