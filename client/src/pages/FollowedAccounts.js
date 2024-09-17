// src/components/FollowedAccounts.js
import React from 'react';
import './css/followedAccounts.css'; // For Followed Accounts component styling

const FollowedAccounts = () => {
  return (
    <div className="followed-accounts-container">
      <h3>Pages/Accounts You Follow</h3>
      <div className="account">
        <img src="account-logo-url" alt="Account Logo" className="account-logo" />
        <div className="account-info">
          <h4>Account Name</h4>
          <p>Account Description</p>
        </div>
      </div>
      {/* Add more followed accounts here */}
    </div>
  );
};

export default FollowedAccounts;
