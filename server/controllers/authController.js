const bcrypt = require('bcryptjs');
const Employer = require('../models/employer');
const Jobseeker = require('../models/jobseeker');
const jwt = require('jsonwebtoken');

// Register Employer
exports.registerEmployer = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;

        // Check if all required fields are provided
        if (!companyName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const existingEmployer = await Employer.findOne({ email });
        if (existingEmployer) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new Employer
        const newEmployer = new Employer({ companyName, email, password: hashedPassword });
        await newEmployer.save();

        res.status(201).json({ message: 'Employer registered successfully' });
    } catch (err) {
        // Log the error for debugging
        console.error('Error in registerEmployer:', err);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};


// Register Jobseeker
exports.registerJobseeker = async (req, res) => {
    try {
        const { name = "", email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingJobseeker = await Jobseeker.findOne({ email });
        if (existingJobseeker) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newJobseeker = new Jobseeker({ name, email, password: hashedPassword });
        await newJobseeker.save();

        res.status(201).json({ message: 'Jobseeker registered successfully' });
    } catch (err) {
        console.error('Error during jobseeker registration:', err);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

// Login with email and password
// Backend: loginWithEmail function (authController.js)
exports.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in either Employer or Jobseeker collection
        let user = await Employer.findOne({ email });
        let userType = '';

        if (user) {
            userType = 'employer';
        } else {
            user = await Jobseeker.findOne({ email });
            if (user) {
                userType = 'jobseeker';
            }
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: userType }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Debugging: Log the userType to verify it's correctly identified
        console.log('User Type:', userType);

        // Respond with token and userType
        res.json({
            token,
            userType // Ensure this is correctly returned
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'An internal server error occurred' });
    }
};



  
// Get jobseeker by email
exports.getUserByEmail = async (req, res) => {
    const { email } = req.query;

    console.log('Received email query:', email);

    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }

    try {
        // Find the jobseeker by email
        const user = await Jobseeker.findOne({ email });

        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({ message: 'Jobseeker not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching jobseeker:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//getuser
exports.getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you are using authMiddleware that attaches the user to req.user
  
      // Query the database for the user profile (check if employer or jobseeker)
      const employer = await Employer.findById(userId); // Adjust this depending on your model structure
      if (!employer) {
        return res.status(404).json({ message: 'Employer not found' });
      }
  
      // Respond with the user's profile
      res.json({
        companyName: employer.companyName,
        email: employer.email,
      });
    } catch (err) {
      console.error('Error fetching employer profile:', err);
      res.status(500).json({ message: 'An internal server error occurred' });
    }
  };