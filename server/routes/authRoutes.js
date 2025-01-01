const express = require('express');
const Job = require('../models/Job');
const Content = require('../models/content');
const {
  registerEmployer,
  registerJobseeker,
  loginWithEmail,
  getUserProfile,
  updateEmployerProfile,
  updateEmployerProfilePicture,
  updateEmployerBackgroundPicture,
  getProfileImage,
  getJobseekerProfile,
  updateJobseekerProfile,
  uploadJobseekerProfilePicture,
  uploadJobseekerBackgroundPicture,
  getJobseekerProfileAndBackgroundImages,
  getAllProfiles
} = require('../controllers/authController');
const {
  postJob,
  getAllJobs,
  getJobsByEmployer,
  getAppliedJobs,
  getEmployerApplications
} = require('../controllers/jobController');
const { postContent, likePost, commentOnPost, getPosts, getCommenterProfileImage, unlikePost } = require('../controllers/contentController');
const  {protect}  = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const contentUpload = require('../middleware/contentUpload');
const jobseekerProfileUploads = require('../middleware/jobseekerProfileUploadsMiddleware');
const { applyToJob, updateApplicationStatus } = require('../controllers/applicationController');
const { sendMessage, getMessages, getConversations } = require('../controllers/messagingController');
const  Employer = require('../models/employer');
const  Jobseeker = require('../models/jobseeker');
const { followAccount, unfollowAccount, checkFollowingStatus, getFollowedAccounts } = require('../controllers/followController');
const { search, searchUser } = require('../controllers/searchController');
const Notification = require('../models/notification');
// Configure Multer for profile and background image uploads
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder where profile images are stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
  },
});

const upload = multer({ storage: profileStorage });


// Register routes
router.post('/jobseeker', registerJobseeker);
router.post('/employer', registerEmployer);
router.post('/login/email', loginWithEmail);

//get all
router.get('/getallprofiles', protect, getAllProfiles);


//JOBSEEKER RPUTES
//get jobseeker profile
router.get('/getJobseekerProfile', protect, getJobseekerProfile);

//update jobseeker profile
router.put('/update/jobseeker', protect, updateJobseekerProfile);

//upload jobseeker profile picture
router.put('/jobseeker/upload/profile-picture', protect, jobseekerProfileUploads.single('profileImage'), uploadJobseekerProfilePicture);

//upload jobseeker background profile picture

router.put('/jobseeker/upload/backgroundprofile', protect, jobseekerProfileUploads.single('backgroundImage'), uploadJobseekerBackgroundPicture);

//get orofile and background
router.get('/jobseeker/images', protect, getJobseekerProfileAndBackgroundImages);








//view profile

// In authRoutes.js

router.get('/employer/:id', protect, async (req, res) => {
  try {
    // Find the employer by ID
    const employer = await Employer.findById(req.params.id).select('-password'); // Exclude password
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    // Fetch jobs posted by the employer
    const jobs = await Job.find({ employer: employer._id });

    // Fetch posts created by the employer
    const posts = await Content.find({ employer: employer._id })
      .populate({
        path: 'comments.user',
        select: 'name profileImage companyName', // Only fetch required fields
      });

    // Return employer data along with jobs and posts
    res.json({
      employer,
      jobs,
      posts,
    });
  } catch (error) {
    console.error('Error fetching employer details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/jobseeker/:id', protect, async (req, res) => {
  try {
      const jobseeker = await Jobseeker.findById(req.params.id).select('-password');
      if (!jobseeker) return res.status(404).json({ message: 'Jobseeker not found' });
      res.json(jobseeker);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

















// EMPLOYER ROUTES
//get employer Profile
router.get('/profile', protect, getUserProfile);
//update profile
router.put('/updateprofile', protect, updateEmployerProfile);

// Profile picture routes
router.put('/uploadProfilePicture', protect, upload.single('profileImage'), updateEmployerProfilePicture);
router.get('/getProfileImage', protect, getProfileImage);

// Background picture routes
router.put('/uploadBackgroundPicture', protect, upload.single('backgroundImage'), updateEmployerBackgroundPicture);



// Post a job
router.post('/post-job', protect, postJob);

///get jobs into the jobseeker
router.get("/jobs", getAllJobs);

router.get("/employer/jobs", protect, getJobsByEmployer);





// Post content for networking
// router.post('/post-contents', protect, postContent);
router.post('/post-contents', protect, contentUpload.array('media', 5), postContent);

// Like a post
router.post('/like-post', protect, likePost);
router.post('/unlike-post', protect, unlikePost);

// Comment on a post
router.post('/comment-post', protect, commentOnPost);
router.get('/commenter-profile/:userId/:userType',protect, getCommenterProfileImage);


///get post content
router.get('/get-posts', protect, getPosts);




//apply job
router.post('/apply-job', protect, applyToJob);
router.get('/my-applied-jobs', protect, getAppliedJobs);
router.get('/employer-applications', protect, getEmployerApplications);


//message

router.post('/send-messages', protect, sendMessage);
router.get('/get-messages', protect, getMessages); 
router.get('/fetch-conversations', protect, getConversations);

//follow

router.post('/follow', protect, followAccount);
router.post('/unfollow', protect, unfollowAccount);
router.get('/following-status', protect, checkFollowingStatus);
router.get('/followed-accounts', protect, getFollowedAccounts);



//search
router.get('/search', search);
router.get ('/search-user', searchUser); 
//status application
router.put('/applications/:applicationId/status', protect, updateApplicationStatus);

//notifications
router.get('/notifications', protect, async (req, res) => {
  // Retrieve the authenticated user's ID (assumes `req.user.id` is set by your authentication middleware)
  const userId = req.user.userId; // Assuming you're storing the authenticated user's ID in `req.user.id`

  try {
    // Query notifications for the logged-in user only
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Sort notifications by `createdAt` in descending order (most recent first)
      .lean();

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


//test
router.get('/test', (req, res) => {
  res.send('API is working!');
});
router.get('/test-auth', protect, (req, res) => {
  res.json({ message: "Authentication successful", user: req.user });
});




module.exports = router;
