import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navigation from '../Jobseeker/Navigation';
import './commonMessaging.css';
const socket = io('http://localhost:5000');  // Ensure this is your actual server

const Messaging = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (userId) {
            fetchMessages();
            socket.on('receiveMessage', addMessage);
            return () => {
                socket.off('receiveMessage', addMessage);
            };
        }
    }, [userId]); // Make sure to add userId as a dependency

    const fetchMessages = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('Authentication token is missing');
                return;
            }
            const response = await axios.get(`/api/auth/messages`, {
                headers: { Authorization: `Bearer ${authToken}` },
                params: { userId }
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const addMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const sendMessage = async () => {
        if (!currentMessage.trim()) return;
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('Authentication token is missing');
                return;
            }
            const messageData = { content: currentMessage, toId: 'receiverId', fromId: userId };
            const response = await axios.post(`/api/auth/messages`, messageData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            socket.emit('sendMessage', response.data.data);
            setCurrentMessage('');
            addMessage(response.data.data);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="messaging-container">
            <div className='messaging-nav'>
            <Navigation/>
            </div>
            
            <div className="messages-list">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.from.id === userId ? 'sent' : 'received'}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <input 
                value={currentMessage} 
                onChange={(e) => setCurrentMessage(e.target.value)} 
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Messaging;
