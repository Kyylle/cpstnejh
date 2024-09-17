const express = require('express');
const { registerEmployer, registerJobseeker, loginWithEmail, signupWithGoogle } = require('../controllers/authController');

const router = express.Router();

router.post('/jobseeker', registerJobseeker); // Ensure this matches your frontend request
router.post('/employer', registerEmployer);
router.post('/login/email', loginWithEmail);
router.post('/signup/google', signupWithGoogle);


module.exports = router;
