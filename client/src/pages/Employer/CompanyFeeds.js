import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/companyFeeds.css'; // Ensure to style it like the example image
import PostJob from './PostJob';
const CompanyFeeds = () => {
    const [feeds, setFeeds] = useState([]);

    useEffect(() => {
        // Fetch feed data from backend
        const fetchFeeds = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Ensure token is available in localStorage
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                    },
                };

                const response = await axios.get('/api/auth/get-posts', config); // Adjust the endpoint to match your backend
                setFeeds(response.data);
            } catch (error) {
                console.error('Error fetching feeds:', error);
            }
        };
        fetchFeeds();
    }, []);

    return (
        <div className='company-page-content'>
            {/* Render the feeds dynamically */}
            <PostJob/>
            <div className='feed-list'>
                {feeds.map((feed, index) => (
                    <div key={index} className='feed-item'>
                        <div className="feed-header">
                            <img
                                src={feed.employer.profileImage || '/default-profile.png'}
                                alt={feed.employer.companyName}
                                className="feed-profile-image"
                            />
                            <div className="feed-details">
                                <h4 className="feed-company-name">{feed.employer.companyName}</h4>
                                <p className="feed-date">
                                    {new Date(feed.postedDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="feed-caption">
                            <p>{feed.caption}</p>
                        </div>

                        {/* Media */}
                        {feed.media && feed.media.length > 0 && (
                            <div className="feed-media">
                                {feed.media.map((mediaUrl, i) => (
                                    <img
                                        key={i}
                                        src={mediaUrl}
                                        alt={`Media ${i + 1}`}
                                        className="feed-media-image"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyFeeds;
