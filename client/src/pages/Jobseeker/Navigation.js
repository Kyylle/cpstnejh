// src/components/Navigation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/navigation.css'; // Import the navigation styles

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">JobHub</div>
        <input type="text" className="navbar-search-bar" placeholder="Search..." />
      </div>
      <div className="navbar-center">
        <button onClick={() => navigate('/dashboard')} className="navbar-button">Home</button>
        <button onClick={() => navigate('/job')} className="navbar-button">Job</button>
        <button onClick={() => navigate('/messaging')} className="navbar-button">Messaging</button>
        <button onClick={() => navigate('/notifications')} className="navbar-button">Notifications</button>
      </div>
      <div className="navbar-right">
        <button onClick={() => navigate('/ProfileMain')} className="navbar-button">Profile</button>
      </div>
    </nav>
  );
};

export default Navigation;
