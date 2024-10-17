import React, { useState } from 'react';
import axios from 'axios';
import './css/applyJobModal.css';

const ApplyJobModal = ({ jobId, closeModal }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [email, setEmail] = useState('');  // Add state to capture email
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('jobId', jobId);
    formData.append('email', email);  // Append email to the form data
    if (resume) {
      formData.append('resume', resume);
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You must be logged in to apply.");
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post('/api/auth/apply-job', formData, config);
      console.log('Application submitted successfully:', response.data);
      closeModal();
    } catch (error) {
      console.error("Error submitting application:", error);
      setError(error.response && error.response.data.message ? error.response.data.message : 'Failed to apply for the job.');
    }
  };

  return (
    <div className="aj-modal-overlay">
      <div className="apply-job-modal">
        <h2>Apply for Job</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="coverLetter">Cover Letter:</label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          ></textarea>
          
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <label htmlFor="resume">Resume:</label>
          <input
            type="file"
            id="resume"
            onChange={handleFileChange}
            required
          />
          
          {error && <p className="error">{error}</p>}
          
          <button type="submit">Submit Application</button>
          <button onClick={closeModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJobModal;
