const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  location: {
    country: { type: String, required: false },
    city: { type: String, required: false },
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  socialLinks: {
    linkedIn: { type: String, required: false },
    twitter: { type: String, required: false },
    facebook: { type: String, required: false },
  },
  logoURL: {
    type: String,
    required: false,
  },
  // Fields for profile photo and background photo
  profilePhotoURL: {
    type: String,
    required: false,
  },
  backgroundPhotoURL: {
    type: String,
    required: false,
  },
  profileUrl: {
    type: String,
    required: false, // URL for the employer's profile
  },
});

module.exports = mongoose.model('Employer', employerSchema);
