import React, { useState } from 'react';
import Navigation from '../Navigation';
import './Inquiries.css';

const EmployerInquiries = () => {
    const [activeTab, setActiveTab] = useState('inquiries'); // Manage which section is active

    const inquiries = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            message: 'I am very interested in the role you posted. My experience in software engineering makes me a great fit for the position.',
            date: '2024-09-20'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            message: 'I have 5 years of experience in the tech industry and would love to contribute to your company’s goals.',
            date: '2024-09-21'
        }
    ];

    const applications = [
        {
            id: 1,
            name: 'Michael Johnson',
            email: 'michael@example.com',
            position: 'Marketing Expert',
            resume: 'Resume.pdf',
            coverLetter: 'CoverLetter.pdf',
            date: '2024-09-22'
        },
        {
            id: 2,
            name: 'Lisa Ray',
            email: 'lisa@example.com',
            position: 'Front-End Developer',
            resume: 'LisaResume.pdf',
            coverLetter: 'LisaCoverLetter.pdf',
            date: '2024-09-23'
        }
    ];

    return (
        <div> <Navigation />
        <div className='inquiries-container'>
         
            {/* Tabs for Inquiries and Applications */}
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

            {/* Inquiries Section */}
            {activeTab === 'inquiries' && (
                <div className='inquiries-list'>
                    <h2>Jobseeker Inquiries</h2>
                    {inquiries.length > 0 ? (
                        inquiries.map((inquiry) => (
                            <div key={inquiry.id} className='inquiry-item'>
                                <button className='name-button'>{inquiry.name}</button>
                                <p><strong>Email:</strong> {inquiry.email}</p>
                                <p><strong>Message:</strong> {inquiry.message}</p>
                                <p className='inquiry-date'><strong>Date:</strong> {inquiry.date}</p>
                            </div>
                        ))
                    ) : (
                        <p>No inquiries yet.</p>
                    )}
                </div>
            )}

            
            {activeTab === 'applications' && (
                <div className='applications-list'>
                    <h2>Job Applications</h2>
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <div key={application.id} className='application-item'>
                                <button className='name-button'>{application.name}</button> {/* Michael Johnson and Lisa Ray as buttons */}
                                <p><strong>Email:</strong> {application.email}</p>
                                <p><strong>Position:</strong> {application.position}</p>
                                <p><strong>Resume:</strong> {application.resume}</p>
                                <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
                                <p className='application-date'><strong>Date:</strong> {application.date}</p>
                            </div>
                        ))
                    ) : (
                        <p>No applications yet.</p>
                    )}
                </div>
            )}
        </div>
        </div>
    );
};

export default EmployerInquiries;



