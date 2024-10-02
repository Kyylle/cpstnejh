const bcrypt = require("bcryptjs");
const Employer = require("../models/employer");
const Jobseeker = require("../models/jobseeker");
const jwt = require("jsonwebtoken");
// const Profile = require("../models/jobseekerProfile");


// Register Employer
exports.registerEmployer = async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    // Validate required fields
    if (!companyName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email is already registered
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Employer
    const newEmployer = new Employer({
      companyName,
      email,
      password: hashedPassword,
    });
    await newEmployer.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newEmployer._id, email: newEmployer.email, userType: "employer" },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and userType in the response
    res.status(201).json({
      message: "Employer registered successfully",
      token, 
      userType: "employer" // This is the userType you need to return
    });
  } catch (err) {
    console.error("Error in registerEmployer:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

// Register Jobseeker
exports.registerJobseeker = async (req, res) => {
  try {
    const { name = "", email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingJobseeker = await Jobseeker.findOne({ email });
    if (existingJobseeker) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newJobseeker = new Jobseeker({
      name,
      email,
      password: hashedPassword,
    });
    await newJobseeker.save();


    //generate token
    const token = jwt.sign(
      { userId: newJobseeker._id, email: newJobseeker.email, userType: "jobseeker" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send response with token
    res.status(201).json({
      message: "Jobseeker registered successfully",
      token, // Return token for frontend to store
      userType: "jobseeker",
    });
  } catch (err) {
    console.error("Error during jobseeker registration:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

// Login with email and password
// Backend: loginWithEmail function (authController.js)
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in either Employer or Jobseeker collection
    let user = await Employer.findOne({ email });
    let userType = "";

    if (user) {
      userType = "employer";
    } else {
      user = await Jobseeker.findOne({ email });
      if (user) {
        userType = "jobseeker";
      }
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, userType: user.userType }, // Use userId and userType
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );


      // Debugging: Log the userType to verify it's correctly identified
      console.log("User Type:", userType);
      console.log(token);

      // Respond with token and userType
      res.json({
        token,
        userType, // Ensure this is correctly returned
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "An internal server error occurred" });
    }
  };





  //JOBSEEKER CONTROLLER
// Get jobseeker profile
exports.getJobseekerProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract the jobseeker ID from the JWT

    // Fetch the jobseeker's profile using the 'jobseeker' field
    let profile = await Jobseeker.findById(userId).select('-password');  // Exclude the password

    if (!profile) {
      return res.status(404).json({ message: 'Jobseeker profile not found' });
    }

    // Construct the response object with relevant profile fields
    const response = {
      name: profile.name || '',  // Fetch name from populated jobseeker field
      email: profile.email,      // Fetch email from populated jobseeker field
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      experience: profile.experience || [],
      skills: profile.skills || [],
      education: profile.education || [],
      profileImage: profile.profileImage || '',
      backgroundImage: profile.backgroundImage || '',
    };

    // Return the profile data
    return res.json(response);
  } catch (err) {
    console.error('Error fetching jobseeker profile:', err);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};


//update jobseeker profile
exports.updateJobseekerProfile = async (req, res) => {
  try {
    console.log(req.body); // Log the request body to check what is being received
    const {
      name,
      bio,
      location,
      website,
      experience,
      skills,
      education,
    } = req.body;

    const jobseekerId = req.user.userId; // Assuming you use the ID from the token

    const updatedJobseeker = await Jobseeker.findByIdAndUpdate(
      jobseekerId,
      {
        name,
        bio,
        location, // Location can be treated as a string
        website,
        experience, // Experience is an array, make sure the structure is correct
        skills, // Skills is an array
        education, // Education is an array
      },
      { new: true } // Return the updated document
    );

    if (!updatedJobseeker) {
      return res.status(404).json({ message: "Jobseeker profile not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      updatedJobseeker,
    });
  } catch (error) {
    console.error("Error updating jobseeker profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for uploading profile picture
exports.uploadJobseekerProfilePicture = async (req, res) => {
  try {
    const jobseekerId = req.user.userId; // Assuming JWT middleware is providing the userId

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received file:', req.file);

    // Construct the file path
    const imagePath = `/jobseekerProfileUploads/${req.file.filename}`; // Path to the uploaded image

    // Update the jobseeker's profile image in the database
    const updatedJobseeker = await Jobseeker.findByIdAndUpdate(
      jobseekerId,
      { profileImage: imagePath }, // Save the image path in the database
      { new: true } // Return the updated document
    );

    if (!updatedJobseeker) {
      return res.status(404).json({ message: 'Jobseeker not found' });
    }

    // Respond with the new image path
    res.status(200).json({
      success: true,
      imagePath: updatedJobseeker.profileImage,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Controller for uploading background picture
exports.uploadJobseekerBackgroundPicture = async (req, res) => {
  try {
    const jobseekerId = req.user.userId; // Assuming JWT middleware is providing the userId

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received file:', req.file);

    // Construct the file path
    const imagePath = `/jobseekerProfileUploads/${req.file.filename}`; // Path to the uploaded image

    // Update the jobseeker's background image in the database
    const updatedJobseeker = await Jobseeker.findByIdAndUpdate(
      jobseekerId,
      { backgroundImage: imagePath }, // Save the image path in the database
      { new: true } // Return the updated document
    );

    if (!updatedJobseeker) {
      return res.status(404).json({ message: 'Jobseeker not found' });
    }

    // Respond with the new image path
    res.status(200).json({
      success: true,
      imagePath: updatedJobseeker.backgroundImage,
      message: 'Background picture updated successfully',
    });
  } catch (error) {
    console.error('Error updating background picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Controller for fetching profile and background images
exports.getJobseekerProfileAndBackgroundImages = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract the jobseeker ID from the JWT

    // Find the jobseeker by their ID (userId)
    let profile = await Jobseeker.findById(userId).select('profileImage backgroundImage');

    if (!profile) {
      return res.status(404).json({ message: 'Jobseeker profile not found' });
    }

    // Construct the response object with profileImage and backgroundImage fields
    const response = {
      profileImage: profile.profileImage || '',
      backgroundImage: profile.backgroundImage || ''
    };

    // Return the images
    return res.json(response);
  } catch (err) {
    console.error('Error fetching profile and background images:', err);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};


















//EMPLOYER CONTROLLERS
//get employer user
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // The decoded token should include the 'id'

    // Fetch the user data based on the user ID (either Employer or Jobseeker)
    let user = await Employer.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construct the response object
    const response = {
      companyName: user.companyName || '',
      email: user.email,
      location: user.location || '',
      headline: user.headline || '',
      website: user.website || '',
      industry: user.industry || '',
      profileImage: user.profileImage || '',
      backgroundImage: user.backgroundImage || '',
    };

    // Return the user data in the response
    return res.json(response);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ message: 'An internal server error occurred' });
  }
};

//updateCompanyProfile

exports.updateEmployerProfile = async (req, res) => {
  try {
    console.log(req.body); // Log the request body to check what is being received
    const {
      companyName,
      pronouns,
      headline,
      location, // Now treated as a string
      email,
      website,
      industry,
    } = req.body;

    const employerId = req.user.userId; // Assuming you use the ID from the token

    const updatedEmployer = await Employer.findByIdAndUpdate(
      employerId,
      {
        companyName,
        pronouns,
        headline,
        location, // Simply assign location as a string
        email,
        website,
        industry,
      },
      { new: true } // Return the updated document
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      updatedEmployer,
    });
  } catch (error) {
    console.error("Error updating employer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller for uploading and updating employer profile picture
exports.updateEmployerProfilePicture = async (req, res) => {
  try {
    const employerId = req.user.id; // Assuming JWT middleware is providing the user

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Received file:', req.file);
    // Construct the file path
    const imagePath = `/uploads/${req.file.filename}`; // Path to the uploaded image

    // Update the employer's profile image in the database
    const updatedEmployer = await Employer.findByIdAndUpdate(
      employerId,
      { profileImage: imagePath }, // Save the image path
      { new: true } // Return the updated document
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Respond with the new image path
    res.status(200).json({
      success: true,
      imagePath: updatedEmployer.profileImage,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update employer background picture
exports.updateEmployerBackgroundPicture = async (req, res) => {
  try {
    const employerId = req.user.userId; // Assuming you have user data in the req.user object (JWT-based authentication)

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct the file path
    const imagePath = `/uploads/${req.file.filename}`;

    // Update the employer's background picture in the database
    const updatedEmployer = await Employer.findByIdAndUpdate(
      employerId,
      { backgroundImage: imagePath },
      { new: true } // Return the updated document
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Send a success response with the new image path
    res.json({
      success: true,
      imagePath: updatedEmployer.backgroundImage,
      message: 'Background picture updated successfully',
    });
  } catch (error) {
    console.error('Error updating employer background picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


//get profile Image
exports.getProfileImage = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the request (after authentication)
    const employer = await Employer.findById(userId).select('profileImage'); // Retrieve only the profile image

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json({ profileImage: employer.profileImage });
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//Post a job
// Post a new job
