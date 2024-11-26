import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../Navigation';
import './Inquiries.css';

const EmployerInquiries = () => {
    const [activeTab, setActiveTab] = useState('applications'); // Default to 'applications' tab
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications(); // Fetch applications immediately on component mount
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/auth/employer-applications', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setApplications(response.data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            setError('Failed to load applications.');
        }
        setIsLoading(false);
    };

    return (
        <div>
            <Navigation />
            <div className='inquiries-container'>
                <div className='tab-buttons'>
                    <button
                        className={activeTab === 'inquiries' ? 'active' : ''}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        Jobseeker Inquiries
                    </button>
                    <button
                        className={activeTab === 'applications' ? 'active' : ''}
                        onClick={() => setActiveTab('applications')}
                    >
                        Job Applications
                    </button>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className='error'>{error}</p>
                ) : (
                    <>
                        {activeTab === 'applications' && (
                            <div className='applications-list'>
                                <h2>Job Applications</h2>
                                {applications.length > 0 ? (
                                    applications.map((application) => (
                                        <div key={application._id} className='application-item'>
                                            <h3>Job Title: <span>{application.jobTitle || 'Name not available'}</span></h3>
                                            <p><strong>Name:</strong> <span>{application.jobseekerName || 'Name not available'}</span></p>
                                            <p><strong>Email:</strong> <span>{application.jobseekerEmail || 'Email not available'}</span></p>
                                            <p><strong>Applied Date:</strong> <span>{application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'Date not available'}</span></p>
                                            <div className='cover-letter'>
                                                <h4>Cover Letter:</h4>
                                                <p>{application.coverLetter || 'No cover letter provided'}</p>
                                            </div>
                                            <p><strong>Resume:</strong> 
                                                {application.resume ? 
                                                    <a href={`http://localhost:5000/${application.resume}`} target="_blank" rel="noopener noreferrer" download>Download Resume</a> : 
                                                    'No resume uploaded'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No applications yet.</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EmployerInquiries;
