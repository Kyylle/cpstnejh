import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import axios from 'axios';
import './css/job.css'; // Ensure CSS is linked
import ApplyJobModal from './ApplyJobModal';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // State to store selected job
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch job listings from the backend API
  useEffect(() => {
    axios.get('/api/auth/jobs')
      .then((response) => {
        setJobs(response.data.jobs);
      })
      .catch((err) => {
        setError('Failed to fetch job listings.');
        console.error('Error fetching jobs:', err);
      });
  }, []);

  // Handle job selection to show full details
  const handleJobSelect = (job) => {
    setSelectedJob(job); // Set selected job without showing the modal
  };

  // Handle clicking the Apply Now button to show the modal
  const handleApplyClick = () => {
    if (selectedJob) {
      setShowModal(true); // Show modal only when Apply Now is clicked
    }
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
            <p>Location</p>
            <p>Company</p>
            <p>Date Posted</p>
          </div>
        </aside>

        {/* Main Job Listings */}
        <main className="job-listings">
          {error && <p className="error">{error}</p>}
          {jobs.map((job) => (
            <div className="job-listing-item" key={job._id}>
              <div>
                <button 
                  className="job-title-btn" 
                  onClick={() => handleJobSelect(job)}
                >
                  {job.jobTitle}
                </button>
                <p>{job.employer?.companyName} • {job.location} • {job.jobType}</p>
              </div>
            </div>
          ))}
        </main>

        {/* Right Sidebar for job details */}
        <aside className="job-right-sidebar">
          {selectedJob ? (
            <div className="job-details">
              <h4>{selectedJob.jobTitle}</h4>
              <p><strong>Company:</strong> {selectedJob.employer?.companyName}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <button onClick={handleApplyClick}>Apply Now</button>
            </div>
          ) : (
            <p>Select a job to view details.</p>
          )}
        </aside>
      </div>

      {showModal && selectedJob && (
        <ApplyJobModal jobId={selectedJob._id} closeModal={() => {
          setShowModal(false);
        }} />
      )}
    </div>
  );
};

export default Job;
