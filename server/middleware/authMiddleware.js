const jwt = require('jsonwebtoken');
const Employer = require('../models/employer');
const Jobseeker = require('../models/jobseeker');

// Middleware to verify JWT and extract user info
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Decode the token and attach the user info to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure that decoded includes the user ID
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Protect middleware to handle both Employer and Jobseeker authentication
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to req object
    req.user = decoded;
    
    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message); // Log the error
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = {
  authMiddleware,
  protect,
};
