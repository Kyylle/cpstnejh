// src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
import './css/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Send a GET request to fetch notifications from the backend
      const response = await axios.get('/api/auth/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Use the JWT stored in localStorage
        },
      });

      // Sort the notifications by createdAt (recent first)
      const sortedNotifications = response.data.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotifications(sortedNotifications); // Update state with the sorted notifications
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Failed to load notifications.');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Navigation />
      <div className="notifications-container">
        <h1>Notifications</h1>

        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : notifications.length > 0 ? (
          <ul className="notifications-list">
            {notifications.map((notification) => (
              <li key={notification._id} className="notification-item">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notifications">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
