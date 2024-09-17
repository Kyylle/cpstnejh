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
// exports.loginWithGoogle = async (req, res) => {
//     try {
//         const { idToken } = req.body;

//         // Verify the ID token with Firebase
//         const decodedToken = await admin.auth().verifyIdToken(idToken);
//         const uid = decodedToken.uid;
//         const email = decodedToken.email;

//         // Find the user by their Firebase UID
//         let user = await Jobseeker.findOne({ firebaseUid: uid });

//         // If the user doesn't exist, create a new Jobseeker
//         if (!user) {
//             user = new Jobseeker({
//                 firebaseUid: uid,
//                 email
//             });
//             await user.save();
//         }

//         // Generate a custom token for further use
//         const customToken = await admin.auth().createCustomToken(uid);

//         // Respond with the custom token
//         res.json({ token: customToken });
//     } catch (err) {
//         console.error('Error during Google sign-in:', err);
//         res.status(500).json({ error: 'An error occurred during Google sign-in' });
//     }
// };

//signup
// In your authController.js
exports.signupWithGoogle = async (req, res) => {
    try {
      const { idToken } = req.body;
  
      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }
  
      // Verify the ID token with Firebase
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const email = decodedToken.email;
  
      // Check if the user exists in the Jobseeker collection
      let user = await Jobseeker.findOne({ firebaseUid: uid });
  
      if (!user) {
        // If user does not exist, create a new Jobseeker
        user = new Jobseeker({ firebaseUid: uid, email });
        await user.save();
        console.log('New Jobseeker created:', user); // Debugging line
      } else {
        console.log('Existing Jobseeker found:', user); // Debugging line
      }
  
      // Generate a custom token to return to the client for further use
      const customToken = await admin.auth().createCustomToken(uid);
      res.json({ token: customToken });
    } catch (err) {
      console.error('Error during Google sign-up:', err);
      res.status(500).json({ error: 'An error occurred during Google sign-up' });
    }
  };

