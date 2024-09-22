import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Add necessary styles here

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      {/* Navigation Bar */}
      <nav className="navbar-home">
        <div className="logo">JobHub</div>
        
        <div className="auth-buttons">
          <button onClick={() => navigate('/signin')} className="nav-button">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="nav-button signup-btn">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="text-section">
          <h1>Your dream Job is just a click away</h1>
          <p>
            A modern recruitment platform designed to streamline the connection
            between employers and job seekers.
          </p>

          {/* Search and Login Button */}
          <div className="search-login">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Find Now" 
            />
            <button className="search-btn">Find</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
