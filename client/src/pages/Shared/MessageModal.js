import React, { useState } from 'react';
import axios from 'axios';
import './css/messageModal.css'; // Ensure CSS is set up for the modal

const MessageModal = ({ isOpen, onClose, toId, userId }) => {
    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            const response = await axios.post('/api/auth/messages', {
                content: message,
                fromId: userId,
                toId: toId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setMessage('');
            onClose();  // Close the modal on successful send
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="message-modal-overlay">
            <div className="message-modal">
                <button onClick={onClose} className="close-modal">X</button>
                <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Type your message here..."
                ></textarea>
                <button onClick={sendMessage} disabled={!message.trim()}>Send</button>
            </div>
        </div>
    );
};

export default MessageModal;
