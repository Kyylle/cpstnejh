const express = require('express');
const { registerEmployer, registerJobseeker, loginWithEmail, getUserProfile} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/jobseeker', registerJobseeker); // Ensure this matches your frontend request
router.post('/employer', registerEmployer);
router.post('/login/email', loginWithEmail);
router.get('/profile', authMiddleware, getUserProfile)

module.exports = router;
