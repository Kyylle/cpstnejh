import React from 'react';
import './css/followedAccounts.css'; // Ensure you have the right CSS file for styling

const FollowedAccounts = () => {
  return (
    <div className="followed-accounts-container">
      <h3>Add to your feed</h3>

      {/* Static list of accounts for now */}
      <div className="account">
        <img src="https://via.placeholder.com/50" alt="Chandresh Desai" className="account-logo" />
        <div className="account-info">
          <h4>Chandresh Desai</h4>
          <p>Founder and CEO @ Cloudairy | Enterprise Architect</p>
          <button className="follow-button">+ Follow</button>
        </div>
      </div>

      <div className="account">
        <img src="https://via.placeholder.com/50" alt="Andreas Klauser" className="account-logo" />
        <div className="account-info">
          <h4>Andreas Klauser</h4>
          <p>CEO at PALFINGER AG | Proactively shaping the future...</p>
          <button className="follow-button">+ Follow</button>
        </div>
      </div>

      <div className="account">
        <img src="https://via.placeholder.com/50" alt="Girish Sharma" className="account-logo" />
        <div className="account-info">
          <h4>Girish Sharma</h4>
          <p>IT Recruitment Consultant at Mgneto Resource...</p>
          <button className="follow-button">+ Follow</button>
        </div>
      </div>

      {/* Option to view more recommendations */}
      <div className="view-more">
        <a href="#">View all recommendations →</a>
      </div>
    </div>
  );
};

export default FollowedAccounts;
