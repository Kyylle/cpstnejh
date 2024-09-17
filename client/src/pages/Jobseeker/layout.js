// src/components/Layout.js
import React from 'react';
import Profile from './Profile';
import Feeds from './Feeds';
import FollowedAccounts from './FollowedAccounts';
import '../css/layout.css'; // Optional: For layout-specific styling

const Layout = () => {
  return (
    <div className="layout-container">
      <div className="left-column">
        <Profile />
      </div>
      <div className="middle-column">
        <Feeds />
      </div>
      <div className="right-column">
        <FollowedAccounts />
      </div>
    </div>
  );
};

export default Layout;
