import React, { useState } from 'react';
import './Message.css';
import Navigation from '../Navigation';

const EmployerMessage = () => {
    // Static users list with updated avatars
    const users = [
        { id: 1, name: 'Noverson Gabito', avatar: '/path-to-your-server/IMG_3405.JPG', lastMessage: 'YeahhHHH!', time: '2 hours ago' },
        { id: 2, name: 'Kyle DaugDaug', avatar: '/path-to-your-server/IMG_3446.JPG', lastMessage: 'FUckk meEE!', time: '5 hours ago' },
        { id: 3, name: 'Cresjhun', avatar: '/path-to-your-server/IMG_3480.JPG', lastMessage: 'uGhHHHH.', time: 'Yesterday' },
    ];

    // Static messages list for the current user
    const staticMessages = [
        { text: 'mangapply ko?', sender: 'received', time: '10:00 AM' },
        { text: 'dili me hiring man .', sender: 'sent', time: '10:05 AM' },
        { text: 'kanus a mo hiring ' },
        { text: 'depende sa sabot naa kay backer.', sender: 'sent', time: '10:15 AM' }
    ];

    // State to simulate the selected user
    const [currentUser, setCurrentUser] = useState(users[0]);

    // State to simulate typing a message
    const [newMessage, setNewMessage] = useState('');

    // Handle sending a message (this is static, so no actual functionality)
    const handleSendMessage = (event) => {
        event.preventDefault();
        if (!newMessage.trim()) return; // Prevents sending empty messages
        setNewMessage('');
        alert(`Message sent: "${newMessage}"`);
    };

    return (
        <div className='employer-message-nav'>
            <Navigation />
            <div className='employer-message-container'>
                {/* Sidebar for users */}
                <div className='sidebar'>
                    <div className="user-list">
                        {users.map(user => (
                            <div
                                key={user.id}
                                className='user-item'
                                onClick={() => setCurrentUser(user)}
                            >
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
                    {currentUser && (
                        <>
                            <div className='chat-header'>
                                <div className="chat-user-info">
                                    <img src={currentUser.avatar} alt={currentUser.name} className='avatar' />
                                    <div className="chat-user-details">
                                        <h3>{currentUser.name}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='chat-messages'>
                                {staticMessages.map((message, index) => (
                                    <div key={index} className={`message ${message.sender === 'sent' ? 'sent' : 'received'}`}>
                                        <p>{message.text}</p>
                                        <span className='time'>{message.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='chat-input'>
                                <input
                                    type='text'
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder='Type a message...'
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployerMessage;

