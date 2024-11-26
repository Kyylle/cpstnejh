import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Navigation from './Navigation'; // Import the Navigation component
import './css/messaging.css';

const Messaging = () => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const userId = localStorage.getItem('userId'); // Logged-in user's ID
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
        query: { userId },
    });

    useEffect(() => {
        // Connect to Socket.IO
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        // Listen for incoming messages
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => {
                if (message.from.id === activeChat || message.to.id === activeChat) {
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, [socket, activeChat]);

    useEffect(() => {
        // Fetch conversations
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/conversations`, {
                    params: { userId },
                });
                setConversations(response.data.conversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, [userId]);

    useEffect(() => {
        // Fetch messages for the active chat
        if (activeChat) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
                        params: { userId: activeChat },
                    });
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
        }
    }, [activeChat]);

    const sendMessage = async () => {
        if (!content || !activeChat) {
            alert('Please provide message content');
            return;
        }

        try {
            socket.emit('sendMessage', { content, toId: activeChat });
            setMessages((prevMessages) => [
                ...prevMessages,
                { content, from: { id: userId }, to: { id: activeChat } },
            ]);
            setContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="messaging-page">
            {/* Add the Navigation bar */}
            <Navigation />

            <div className="messaging-container">
                <div className="sidebar">
                    <h2>Chats</h2>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`conversation ${conversation.id === activeChat ? 'active' : ''}`}
                            onClick={() => setActiveChat(conversation.id)}
                        >
                            <img
                                src={conversation.avatar || '/default-avatar.png'}
                                alt="User Avatar"
                                className="avatar"
                            />
                            <div className="conversation-info">
                                <h3>{conversation.name}</h3>
                                <p>{conversation.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chat-window">
                    {activeChat ? (
                        <>
                            <div className="chat-header">
                                <h3>{conversations.find((c) => c.id === activeChat)?.name}</h3>
                            </div>
                            <div className="chat-body">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.from.id === userId ? 'sent' : 'received'}`}
                                    >
                                        {message.content}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <textarea
                                    placeholder="Type your message..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messaging;
