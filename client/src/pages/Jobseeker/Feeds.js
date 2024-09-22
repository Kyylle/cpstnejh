import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/feeds.css'; // For Feeds component styling

const Feeds = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [hasAnsweredHiring, setHasAnsweredHiring] = useState(false);

  useEffect(() => {
    // Check if the user's name is in local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.name) {
      setUser(storedUser);
    } else {
      // Fetch the user info from the server (MongoDB)
      fetchUserFromDB();
    }

    // Check if user has already answered the hiring question
    const answeredHiringStatus = localStorage.getItem('hasAnsweredHiring') || false;
    setHasAnsweredHiring(answeredHiringStatus);
  }, []);

  const fetchUserFromDB = async () => {
    try {
      const email = JSON.parse(localStorage.getItem('user')).email; // Assuming email is stored in local storage after login
      const response = await axios.get(`/api/auth/user?email=${email}`); // Fetch user from MongoDB using their email
      const fetchedUser = response.data;
      
      // Update state and save user info in local storage
      setUser(fetchedUser);
      localStorage.setItem('user', JSON.stringify(fetchedUser));
    } catch (error) {
      console.error('Error fetching user from DB:', error);
    }
  };

  const handleHiringResponse = (isHiring) => {
    // Save user's response to local storage or make an API call to persist the response
    setHasAnsweredHiring(true);
    localStorage.setItem('hasAnsweredHiring', true);
    console.log(`${user.name} is hiring: ${isHiring}`);
  };

  return (
    <div className="feeds-container">
      {!hasAnsweredHiring && user.name && (
        <div className="hiring-question">
          <div className="profile-image">
            <img src="/path-to-default-avatar.png" alt="User Avatar" /> {/* Placeholder for user's profile image */}
          </div>
          <div className="hiring-content">
            <h3>Hi {user.name}, are you hiring?</h3>
            <p>Discover free and easy ways to find a great hire, fast.</p>
            <div className="hiring-buttons">
              <button onClick={() => handleHiringResponse(true)}>Yes, I'm hiring</button>
              <button onClick={() => handleHiringResponse(false)}>No, not right now</button>
            </div>
          </div>
        </div>
      )}

      <div className="post">
        <h3>Post Title</h3>
        <p>Post content goes here. This is a placeholder for the feed post.</p>
      </div>
      {/* Add more posts or content here */}
    </div>
  );
};

export default Feeds;
