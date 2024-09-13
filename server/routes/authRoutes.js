const express = require('express');
const { registerEmployer, registerJobseeker, loginWithEmail, loginWithGoogle } = require('../controllers/authController');

const router = express.Router();

router.post('/jobseeker', registerJobseeker); // Ensure this matches your frontend request
router.post('/employer', registerEmployer);
router.post('/login/email', loginWithEmail);
router.post('/login/google', loginWithGoogle);

module.exports = router;
