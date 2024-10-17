// components/Messaging.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navigation from './Navigation';
import './css/messaging.css';

const Messaging = () => {
    const [messages, setMessages] = useState({ All: [], Unread: [] });
    const [socket, setSocket] = useState(null);
    const userId = localStorage.getItem('userId');

    // Initialize Socket.IO
    useEffect(() => {
        const newSocket = io('http://localhost:5000', { query: { userId } });
        setSocket(newSocket);

        // Listen for new messages in real-time
        newSocket.on('receiveMessage', (newMessage) => {
            setMessages((prev) => ({
                ...prev,
                All: [newMessage, ...prev.All],
                Unread: [newMessage, ...prev.Unread],
            }));
        });

        return () => newSocket.close(); // Cleanup on unmount
    }, [userId]);

    // Fetch messages from backend
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('/api/auth/messages', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    params: { userId },
                });
                setMessages({
                    All: response.data.messages,
                    Unread: response.data.messages.filter((msg) => !msg.read),
                });
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [userId]);

    return (
        <div>
            <Navigation />
            <div className="messaging-container">
                <div className="message-list">
                    {messages.All.map((msg, index) => (
                        <div key={index} className="message-item">
                            <p>{msg.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Messaging;
