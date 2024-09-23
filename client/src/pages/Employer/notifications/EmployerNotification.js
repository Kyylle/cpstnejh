import React, { useState } from 'react';
import './Notifications.css';
import Navigation from '../Navigation';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('all');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div><Navigation />
        <div className='notification-container'>
            
            <div className="notifications-header">
                <button 
                    className={activeTab === 'all' ? 'active' : ''} 
                    onClick={() => handleTabChange('all')}
                >
                    All
                </button>
                <button 
                    className={activeTab === 'jobs' ? 'active' : ''} 
                    onClick={() => handleTabChange('jobs')}
                >
                    Jobs
                </button>
                <button 
                    className={activeTab === 'myPost' ? 'active' : ''} 
                    onClick={() => handleTabChange('myPost')}
                >
                    My Post
                </button>
                
            </div>
            <div className="notifications-content">
                {activeTab === 'all' && <div>All Notifications will be shown here.</div>}
                {activeTab === 'jobs' && <div>Jobs Notifications will be shown here.</div>}
                {activeTab === 'myPost' && <div>My Post Notifications will be shown here.</div>}
            </div>
            
                
           
        </div>
        </div>
    );
};

export default Notifications;
