import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './Message.css';
import Navigation from '../Navigation';

const socket = io('http://localhost:5000'); // Ensure this points to your server

const EmployerMessage = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchMessages(currentUser.id);
            const listener = (newMessage) => {
                if (newMessage.from.id === currentUser.id || newMessage.to.id === currentUser.id) {
                    setMessages(prev => [...prev, newMessage]);
                }
            };
            socket.on('receiveMessage', listener);
            return () => socket.off('receiveMessage', listener);
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/auth/messages/threads', {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setUsers(response.data); // Assume response.data contains an array of user threads
        } catch (error) {
            console.error('Error fetching user threads:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(`/api/auth/messages/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setMessages(response.data.messages); // Assume response.data.messages contains the messages
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (!newMessage.trim() || !currentUser) return;
        
        try {
            const messageData = {
                content: newMessage,
                toId: currentUser.id
            };
            const response = await axios.post('/api/auth/messages', messageData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            socket.emit('sendMessage', response.data.message);
            setNewMessage('');
            setMessages(prev => [...prev, response.data.message]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className='employer-message-nav'>
            <Navigation />
            <div className='employer-message-container'>
                <div className='sidebar'>
                    {users.map(user => (
                        <div key={user.id} className='user-item' onClick={() => setCurrentUser(user)}>
                            <img src={user.avatar || '/default-avatar.png'} alt={user.name} className='avatar' />
                            <div className='user-info'>
                                <h4>{user.name}</h4>
                                <p>{user.lastMessage}</p>
                            </div>
                            <span className='time'>{user.time}</span>
                        </div>
                    ))}
                </div>
                <div className='chat-section'>
                    {currentUser && (
                        <>
                            <div className='chat-header'>
                                <div className="chat-user-info">
                                    <img src={currentUser.avatar || '/default-avatar.png'} alt={currentUser.name} className='avatar' />
                                    <div className="chat-user-details">
                                        <h3>{currentUser.name}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='chat-messages'>
                                {messages.map((message, index) => (
                                    <div key={index} className={`message ${message.from.id === currentUser.id ? 'received' : 'sent'}`}>
                                        <p>{message.text}</p>
                                        <span className='time'>{message.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className='chat-input'>
                                <input type='text' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder='Type a message...' />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerMessage;
