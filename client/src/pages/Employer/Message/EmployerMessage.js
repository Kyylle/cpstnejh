import React, { useState, useEffect } from 'react';
import './Message.css';
import Navigation from '../Navigation';
import axios from 'axios';

const EmployerMessage = () => {
    const [users, setUsers] = useState([]); // For user list
    const [currentUser, setCurrentUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchUsersAndMessages = async () => {
            try {
                // Assuming '/api/profile' would fetch all users for the employer to chat with
                const usersResponse = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                setUsers(usersResponse.data);
                if (usersResponse.data.length > 0) {
                    setCurrentUser(usersResponse.data[0]);
                    fetchMessagesForUser(usersResponse.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        const fetchMessagesForUser = async (userId) => {
            try {
                // This would need a backend route to fetch messages by user ID
                const messagesResponse = await axios.get(`/api/auth/messages/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                setMessages(messagesResponse.data);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };

        fetchUsersAndMessages();
    }, []);

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (!newMessage.trim()) return;  // Prevents sending empty messages
        try {
            const messageData = { text: newMessage, senderId: currentUser.id }; // Adjust based on your backend needs
            const sentMessage = await axios.post('/api/messages', messageData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setMessages([...messages, sentMessage.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
        <div className='employer-message-nav'>
            <Navigation />
            <div className='employer-message-container'>
                {/* Sidebar */}
                <div className='sidebar'>
                    <div className="user-list">
                        {users.map(user => (
                            <div key={user.id} className='user-item' onClick={() => setCurrentUser(user)}>
                                <img src={user.avatar} alt={user.name} className='avatar' />
                                <div className='user-info'>
                                    <h4>{user.name}</h4>
                                    <p>{user.lastMessage}</p> {/* This might need to be fetched/updated dynamically */}
                                </div>
                                <span className='time'>{user.time}</span> {/* Time could be the time of the last message */}
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
