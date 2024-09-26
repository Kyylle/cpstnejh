const express = require('express');
const cors = require('cors'); // Middleware for handling CORS
const connectDB = require('./config/db'); // DB connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);


// Check if 'uploads' folder exists, if not, create it
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware for handling CORS (frontend-backend communication)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes at /api/auth


// Additional Middleware or Route Grouping can go here

// Global Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred' });
});


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (data) => {
    io.emit('message', data);  // This will emit the data to all clients connected
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
