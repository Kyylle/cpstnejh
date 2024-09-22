// src/components/Notifications.js
import React from 'react';
import Navigation from './Navigation';
import './css/Notifications.css'

const notificationsData = [
  {
    id: 1,
    message: 'You have a new job recommendation: Software Engineer at ABC Corp.',
    time: '2m ago',
  },
  {
    id: 2,
    message: 'Your application for the Marketing Manager position has been viewed.',
    time: '10m ago',
  },
  {
    id: 3,
    message: 'Congratulations! You have been invited for an interview for the Graphic Designer role.',
    time: '1h ago',
  },
  {
    id: 4,
    message: 'New updates are available for your resume. Please review them.',
    time: '3h ago',
  },
];

const Notifications = () => {
  return (
    <div><Navigation />
    <div className='notifications-container'>
      
      <h1>Notifications</h1>
      <ul className='notifications-list'>
        {notificationsData.map((notification) => (
          <li key={notification.id} className='notification-item'>
            <p>{notification.message}</p>
            <span className='notification-time'>{notification.time}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Notifications;
