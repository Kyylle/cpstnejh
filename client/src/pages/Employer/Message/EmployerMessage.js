import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../Navigation"; // Ensure path is correct

const EmployerMessage = () => {
  const [followedAccounts, setFollowedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch followed accounts
  const fetchFollowedAccounts = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get("/api/auth/followed-accounts", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFollowedAccounts(response.data.followedAccounts);
    } catch (error) {
      console.error("Error fetching followed accounts:", error);
    }
  };

  // Fetch messages when an account is selected
  const fetchMessages = async () => {
    if (!selectedAccount) return;

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `/api/auth/fetch-conversations?userId=${selectedAccount.id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const conversation = response.data.conversations?.[0] || {};
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchFollowedAccounts();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedAccount]);

  // Send message to selected account
  const sendMessage = async () => {
    if (!messageContent || !selectedAccount) {
      return alert("Please select a user and enter a message.");
    }

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "/api/auth/send-messages",
        { content: messageContent, toId: selectedAccount.id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setMessageContent(""); // Clear message input
      fetchMessages(); // Fetch updated messages
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  // Handle keydown for Enter key in the textarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messaging-page bg-gray-100 min-h-screen flex flex-col md:flex-row">
      <Navigation />

      <div className="users-sidebar w-full md:w-1/4 bg-white border-b md:border-r p-4 mt-20 md:mt-15">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Chats</h3>
        {followedAccounts.length > 0 ? (
          <div className="space-y-4">
            {followedAccounts.map((account) => (
              <div
                key={account.id}
                className="account-item flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => setSelectedAccount(account)}
              >
                <img
                  src={
                    account.avatar ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt={account.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <span className="text-lg font-medium text-gray-800">
                  {account.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No followed accounts found.</p>
        )}
      </div>

      <div className="chat-section flex-1 bg-gray-50 p-6 flex flex-col mt-20 md:mt-16">
        {selectedAccount && (
          <>
            <div className="chat-header flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={selectedAccount.avatar || "/default-avatar.png"}
                  alt={selectedAccount.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <span className="text-xl font-semibold text-gray-800">
                  {selectedAccount.name}
                </span>
              </div>
            </div>

            <div
              className="messages-container flex-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 320px)" }}
            >
              {messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message-item ${
                        message.from?.id === selectedAccount?.id
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      <div
                        className={`message-bubble ${
                          message.from?.id === selectedAccount?.id
                            ? "bg-gray-200"
                            : "bg-blue-500 text-white"
                        } px-4 py-2 rounded-lg max-w-[80%] inline-block`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </div>
              ) : (
                <p className="text-gray-500">No messages yet.</p>
              )}
            </div>

            <div className="message-form flex items-center space-x-4 mt-4">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                rows="3"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerMessage;
