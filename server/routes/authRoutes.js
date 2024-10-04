const express = require('express');
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
  postJob
} = require('../controllers/jobController');
const { postContent, likePost, commentOnPost, getPosts } = require('../controllers/contentController');
const  {protect}  = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const contentUpload = require('../middleware/contentUpload');
const jobseekerProfileUploads = require('../middleware/jobseekerProfileUploadsMiddleware');
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
router.put('/update/jobseeker', protect, updateJobseekerProfile)

//upload jobseeker profile picture
router.put('/jobseeker/upload/profile-picture', protect, jobseekerProfileUploads.single('profileImage'), uploadJobseekerProfilePicture);

//upload jobseeker background profile picture

router.put('/jobseeker/upload/backgroundprofile', protect, jobseekerProfileUploads.single('backgroundImage'), uploadJobseekerBackgroundPicture);

//get orofile and background
router.get('/jobseeker/images', protect, getJobseekerProfileAndBackgroundImages);




















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







// Post content for networking
// router.post('/post-contents', protect, postContent);
router.post('/post-contents', protect, contentUpload.array('media', 5), postContent);

// Like a post
router.post('/like-post', protect, likePost);

// Comment on a post
router.post('/comment-post', protect, commentOnPost);



///get post content
router.get('/get-posts', protect, getPosts);







router.get('/test', (req, res) => {
  res.send('API is working!');
});
router.get('/test-auth', protect, (req, res) => {
  res.json({ message: "Authentication successful", user: req.user });
});


module.exports = router;
