const express = require('express');
const cors = require('cors'); // Middleware for handling CORS
const connectDB = require('./config/db'); // DB connection
const authRoutes = require('./routes/authRoutes'); // Auth routes
const userRoutes = require('./routes/userRoutes'); // Example of additional routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware for handling CORS (frontend-backend communication)

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

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
