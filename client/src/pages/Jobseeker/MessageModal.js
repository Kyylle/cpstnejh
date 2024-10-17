// components/MessageModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './css/messageModal.css'; // Make sure the CSS file is available

const socket = io('http://localhost:5000'); // Adjust the URL if needed

const MessageModal = ({ profile, isOpen, onClose, fromId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchMessages(); // Fetch previous messages when modal opens

            // Listen for real-time messages
            socket.on('receiveMessage', (newMessage) => {
                if (
                    (newMessage.from.id === fromId && newMessage.to.id === profile._id) ||
                    (newMessage.from.id === profile._id && newMessage.to.id === fromId)
                ) {
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            });
        }

        return () => {
            socket.off('receiveMessage'); // Cleanup on unmount or close
        };
    }, [isOpen, profile]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('authToken'); // Get the token from localStorage
            const config = {
                headers: { Authorization: `Bearer ${token}` }, // Attach token to request
                params: { userId: fromId }, // Query param to identify user
            };

            const response = await axios.get(`/api/auth/messages`, config);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return; // Prevent sending empty messages

        try {
            const token = localStorage.getItem('authToken'); // Retrieve the token again
            const config = {
                headers: { Authorization: `Bearer ${token}` }, // Include token in request
            };

            const payload = {
                content: message,
                fromId,
                toId: profile._id,
            };

            const response = await axios.post('/api/auth/messages', payload, config);
            setMessages([...messages, response.data.data]); // Update with new message
            setMessage(''); // Clear input field

            // Emit message via Socket.IO
            socket.emit('sendMessage', response.data.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!isOpen) return null; // Don't render the modal if not open

    return (
        <div className="message-modal-overlay">
            <div className="message-modal">
                <button className="close-modal" onClick={onClose}>×</button>

                <div className="modal-header">
                    <img
                        src={profile.profileImage || '/default-profile.png'}
                        alt={profile.name || profile.companyName}
                        className="modal-profile-image"
                    />
                    <h3>{profile.name || profile.companyName}</h3>
                </div>

                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-item ${
                                msg.from.id === fromId ? 'outgoing' : 'incoming'
                            }`}
                        >
                            <p>{msg.content}</p>
                        </div>
                    ))}
                </div>

                <div className="message-input-container">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="message-input"
                    />
                    <button
                        className="send-message-btn"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
