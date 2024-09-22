import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import axios from 'axios';
import './css/job.css'; // Ensure CSS is linked

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // State to store selected job
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job listings from mockAPI
  useEffect(() => {
    axios.get('https://6635e420415f4e1a5e25977e.mockapi.io/NewData') // Use your actual endpoint
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch job listings.');
        setLoading(false);
      });
  }, []);

  // Handle job selection to show full details on the right sidebar
  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  if (loading) return <p>Loading job listings...</p>;
  if (error) return <p>{error}</p>;

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
            <div className="job-listing-item" key={job.id}>
              <div>
                <button 
                  className="job-title-btn" 
                  onClick={() => handleJobSelect(job)}
                >
                  {job.title}
                </button>
                <p>{job.company} • {job.location} • {job.type}</p>
              </div>
              <button>Apply</button>
            </div>
          ))}
        </main>

        {/* Right Sidebar for job details */}
        <aside className="right-sidebar">
          {selectedJob ? (
            <div className="job-details">
              <h4>{selectedJob.title}</h4>
              <p><strong>Company:</strong> {selectedJob.company}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Job Type:</strong> {selectedJob.type}</p>
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
