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
} = require('../controllers/authController');
const {
  postJob
} = require('../controllers/jobController');
const { postContent, likePost, commentOnPost } = require('../controllers/contentController');
const  {protect}  = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();

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

// Configure Multer for content uploads (images, videos)
// const contentStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'contentuploads/'); // Specify the folder where content images/videos are stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
//   },
// });

// const contentUpload = multer({ storage: contentStorage });

// Register routes
router.post('/jobseeker', registerJobseeker);
router.post('/employer', registerEmployer);
router.post('/login/email', loginWithEmail);

// Profile routes
router.get('/profile', protect, getUserProfile);
router.put('/updateprofile', protect, updateEmployerProfile);

// Profile picture routes
router.put('/uploadProfilePicture', protect, upload.single('profileImage'), updateEmployerProfilePicture);
router.get('/getProfileImage', protect, getProfileImage);

// Background picture routes
router.put('/uploadBackgroundPicture', protect, upload.single('backgroundImage'), updateEmployerBackgroundPicture);

// Post a job
router.post('/post-job', protect, postJob);

// Post content for networking
router.post('/post-contents', protect, postContent);

// Like a post
router.post('/like-post', protect, likePost);

// Comment on a post
router.post('/comment-post', protect, commentOnPost);


router.get('/test', (req, res) => {
  res.send('API is working!');
});
router.get('/test-auth', protect, (req, res) => {
  res.json({ message: "Authentication successful", user: req.user });
});


module.exports = router;
