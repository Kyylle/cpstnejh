import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyAnalytics = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // Fetch recommendations or analytics data from backend
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get('/api/company/recommendations');
                setRecommendations(response.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
        fetchRecommendations();
    }, []);

    return (
        <div className='page-content'>
            <h4>Add to your feed</h4>
            {/* Render recommendations dynamically */}
            <div className='recommendations-list'>
                {recommendations.map((rec, index) => (
                    <div key={index} className='recommendation-item'>
                        <p>{rec.name}</p>
                        <button className="follow-btn">+ Follow</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompanyAnalytics;
