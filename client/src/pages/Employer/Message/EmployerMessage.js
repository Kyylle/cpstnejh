import React from 'react';
import './Message.css';
import Navigation from '../Navigation';

const EmployerMessage = () => {
    const users = [
        { id: 1, name: 'Rebecca Dixon', lastMessage: 'How do you know about ...', time: '11:29 AM', avatar: '/path/to/avatar1.jpg' },
        { id: 2, name: 'Sarah Howard', lastMessage: 'Downtown from 13 to 18...', time: '1:45 PM', avatar: '/path/to/avatar2.jpg' },
        // Add more users...
    ];

    const messages = [
        { sender: 'Sarah', time: '1:45 PM', text: 'We have available rooms from 25 to 30 August in downtown.' },
        { sender: 'me', time: '1:46 PM', text: 'Hello Sarah' },
        { sender: 'Sarah', time: '1:47 PM', text: 'That’s great. Waiting for pics from you.' },
        // Add more messages...
    ];

    const currentUser = {
        name: 'Sarah Howard',
        avatar: '/path/to/avatar2.jpg',
        sharedFiles: [
            { name: 'City Guide.pdf', url: '#' },
            { name: 'Service Price.doc', url: '#' },
            // Add more files...
        ],
        sharedMedia: [
            { imageUrl: '/path/to/media1.jpg' },
            { imageUrl: '/path/to/media2.jpg' },
            // Add more media...
        ],
    };

    return (
        <div className='employer-message-nav'>
            <Navigation />
            <div className='employer-message-container'>
                {/* Sidebar */}
                <div className='sidebar'>
                    <div className="user-list">
                        {users.map(user => (
                            <div key={user.id} className='user-item'>
                                <img src={user.avatar} alt={user.name} className='avatar' />
                                <div className='user-info'>
                                    <h4>{user.name}</h4>
                                    <p>{user.lastMessage}</p>
                                </div>
                                <span className='time'>{user.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Section */}
                <div className='chat-section'>
                    <div className='chat-header'>
                        <div className="chat-user-info">
                            <img src={currentUser.avatar} alt={currentUser.name} className='avatar' />
                            <div className="chat-user-details">
                                <h3>{currentUser.name}</h3>
                                <span>Active now</span>
                            </div>
                        </div>
                    </div>
                    <div className='chat-messages'>
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}>
                                <p>{message.text}</p>
                                <span className='time'>{message.time}</span>
                            </div>
                        ))}
                    </div>
                    <div className='chat-input'>
                        <input type='text' placeholder='Type a message...' />
                        <button>Send</button>
                    </div>
                </div>

                {/* User Profile */}
                <div className='user-profile'>
                    <img src={currentUser.avatar} alt={currentUser.name} className='profile-avatar' />
                    <h3>{currentUser.name}</h3>
                    <button>Add to favorites</button>
                    <div className='shared-files'>
                        <h4>Shared Files</h4>
                        <ul>
                            {currentUser.sharedFiles.map((file, index) => (
                                <li key={index}><a href={file.url}>{file.name}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div className='shared-media'>
                        <h4>Shared Media</h4>
                        <div className='media-list'>
                            {currentUser.sharedMedia.map((media, index) => (
                                <img key={index} src={media.imageUrl} alt={`Media ${index + 1}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployerMessage;
