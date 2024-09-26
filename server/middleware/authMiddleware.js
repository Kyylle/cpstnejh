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
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user data to the request object
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Protect middleware to handle both Employer and Jobseeker authentication
const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header contains the Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the authorization header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find the user (Employer or Jobseeker) by their decoded id
      let user = await Employer.findById(decoded.userId).select('-password');
      if (!user) {
        user = await Jobseeker.findById(decoded.userId).select('-password');
      }

      // If user not found in either collection
      if (!user) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      // Attach the user to the request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Not authorized, token failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// Export both middlewares
module.exports = {
  authMiddleware,
  protect
};
