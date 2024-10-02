import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyFeeds = () => {
    const [feeds, setFeeds] = useState([]);

    useEffect(() => {
        // Fetch feed data from backend
        const fetchFeeds = async () => {
            try {
                const response = await axios.get('/api/company/feeds');
                setFeeds(response.data);
            } catch (error) {
                console.error('Error fetching feeds:', error);
            }
        };
        fetchFeeds();
    }, []);

    return (
        <div className='company-page-content'>
            <div className='create-post'>
                <input type="text" placeholder="Start a post" className="create-post-input" />
                <button className="media-btn">Media</button>
                <button className="event-btn">Event</button>
                <button className="article-btn">Write article</button>
            </div>

            {/* Render the feeds dynamically */}
            <div className='feed-list'>
                {feeds.map((feed, index) => (
                    <div key={index} className='feed-item'>
                        <h4>{feed.title}</h4>
                        <p>{feed.description}</p>
                        <img src={feed.image} alt="feed-img" className="feed-img" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompanyFeeds;
