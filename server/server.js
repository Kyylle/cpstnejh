const express = require('express');
const cors = require('cors'); // Middleware for handling CORS
const connectDB = require('./config/db'); // MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const path = require('path');
const fs = require('fs');
const http = require('http');
const { setupSocket } = require('./socket'); // Socket.IO setup

require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app); // Create HTTP server
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for frontend-backend communication

// Static file handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/contentuploads', express.static(path.join(__dirname, 'contentuploads')));
app.use('/jobseekerProfileUploads', express.static(path.join(__dirname, 'jobseekerProfileUploads')));

// Ensure 'uploads' folder exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes at /api/auth

// Setup Socket.IO
setupSocket(server);

// Global Error Handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
