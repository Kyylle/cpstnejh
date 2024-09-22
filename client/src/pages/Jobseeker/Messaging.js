import React, { useState } from 'react';
import Navigation from './Navigation';
import './css/messaging.css'; // Assume the necessary CSS file is here

const Messaging = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const messages = {
    All: [],
    Unread: []
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div><Navigation />
    <div className='messaging-container'>
      
      
      <div className='messaging-content'>
        <div className='messaging-header'>
            <h3>Messages</h3>
          <input
            type='text'
            className='messaging-search'
            placeholder='Search messages'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs for All and Unread */}
        <div className='messaging-tabs'>
          {['All', 'Unread'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className='messaging-body'>
          {/* Message List */}
          <div className='message-list'>
            {messages[activeTab].length === 0 ? (
              <div className='no-messages'>
                <img src='placeholder-image-url' alt='No messages' className='no-messages-image' />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className='message-items'>
                {/* Render the list of messages */}
                {messages[activeTab].map((message, index) => (
                  <div key={index} className='message-item'>
                    {message.content}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Message Section */}
          <div className='new-message'>
            <h3>New message</h3>
            <input type='text' placeholder='Type a name or multiple names' />
            <p>No results found</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Messaging;
