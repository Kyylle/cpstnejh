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
const { protect } = require('../middleware/authMiddleware'); // Use only `protect` for consistency
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder where images are stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
  },
});

const upload = multer({ storage: storage });

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

module.exports = router;
