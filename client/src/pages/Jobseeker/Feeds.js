// src/components/Feeds.js
import React from 'react';
import '../css/feeds.css'; // For Feeds component styling

const Feeds = () => {
  return (
    <div className="feeds-container">
      <div className="post">
        <h3>Post Title</h3>
        <p>Post content goes here. This is a placeholder for the feed post.</p>
      </div>
      {/* Add more posts or content here */}
    </div>
  );
};

export default Feeds;
