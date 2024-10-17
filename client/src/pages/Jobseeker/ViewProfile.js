// ViewProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/viewProfile.css'; 
import NavigationJobseeker from './Navigation';
import MessageModal from './MessageModal'; // Import the modal component

const ViewProfile = () => {
    const { type, id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const endpoint = type === 'employer' 
                    ? `/api/auth/employer/${id}` 
                    : `/api/auth/jobseeker/${id}`;

                const response = await axios.get(endpoint, config);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [type, id]);

    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>Profile not found.</p>;

    return (
        <div className='vp-navbar'>
            <NavigationJobseeker />
            <div className="profile-container">
                <div className="profile-banner">
                    <img 
                        className="profile-background"
                        src={profile.backgroundImage || '/default-background.png'} 
                        alt="Background"
                    />
                </div>

                <div className="profile-header">
                    <img 
                        className="profile-image"
                        src={profile.profileImage || '/default-profile.png'} 
                        alt={profile.name || profile.companyName}
                    />
                    <div className="vp-profile-info">
                        <h2>{profile.name || profile.companyName}</h2>
                        <p className="profile-location">{profile.location}</p>
                        <p className="profile-industry">{profile.industry || profile.skills?.join(', ')}</p>
                        <p className="profile-bio">{profile.description || profile.bio}</p>
                    </div>
                </div>

                <div className="profile-buttons">
                    <button className="btn-follow">+ Follow</button>
                    <button className="btn-message" onClick={() => setIsModalOpen(true)}>
                        Message
                    </button>
                    <button className="btn-appointment">Book an appointment</button>
                    <button className="btn-more">More</button>
                </div>

                {/* Render the Message Modal */}
                <MessageModal 
                    profile={profile} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            </div>
        </div>
    );
};

export default ViewProfile;
