const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { setupSocket } = require('./socket'); // Import your Socket.IO setup

require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for frontend-backend communication

// Static Files Setup
const directories = [
    'uploads',
    'contentuploads',
    'jobseekerProfileUploads',
    path.join('applications', 'resumes'),
];

// Ensure all directories exist
directories.forEach((dir) => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/contentuploads', express.static(path.join(__dirname, 'contentuploads')));
app.use('/jobseekerProfileUploads', express.static(path.join(__dirname, 'jobseekerProfileUploads')));
app.use('/applications/resumes', express.static(path.join(__dirname, 'applications', 'resumes')));

// MongoDB Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Auth routes

// Setup Socket.IO
setupSocket(server); // Assuming this sets up and exports Socket.IO instance

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ 
        message: err.message || 'Internal server error' 
    });
});

// Start Server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
