const admin = require('../config/firebase');
const bcrypt = require('bcryptjs');
const Employer = require('../models/employer');
const Jobseeker = require('../models/jobseeker');

// Register employer
exports.registerEmployer = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;

        // Check if all required fields are provided
        if (!companyName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new Employer
        const newEmployer = new Employer({ companyName, email, password: hashedPassword });
        await newEmployer.save();

        res.status(201).json({ message: 'Employer registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Register jobseeker
exports.registerJobseeker = async (req, res) => {
    try {
      const { name = "", email, password } = req.body; // Destructure fields
  
      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Check if the email is already registered
      const existingJobseeker = await Jobseeker.findOne({ email });
      if (existingJobseeker) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // Hash the password before saving the jobseeker
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new Jobseeker
      const newJobseeker = new Jobseeker({ name, email, password: hashedPassword });
      await newJobseeker.save();
  
      // Respond with success message
      res.status(201).json({ message: 'Jobseeker registered successfully' });
    } catch (err) {
      // Log the error and respond with an error message
      console.error('Error during jobseeker registration:', err);
      res.status(500).json({ error: 'An internal server error occurred' });
    }
  };




// Login with email and password
exports.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Employer.findOne({ email }) || await Jobseeker.findOne({ email });
        if (!user) return res.status(401).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = await admin.auth().createCustomToken(user._id.toString());
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
};


// Login with Google
exports.loginWithGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Check if the user exists by firebaseUid instead of _id
        let user = await Employer.findOne({ firebaseUid: uid }) || await Jobseeker.findOne({ firebaseUid: uid });

        if (!user) {
            // If the user does not exist, create a new Jobseeker (or Employer) with firebaseUid
            user = new Jobseeker({ firebaseUid: uid, email: decodedToken.email });
            await user.save();
        }

        // Generate a custom token to return
        const customToken = await admin.auth().createCustomToken(uid);
        res.json({ token: customToken });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'An error occurred during Google sign-in' });
    }
};
