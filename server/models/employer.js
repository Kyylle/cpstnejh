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
  location: {
    type: String, // Change from nested object to a simple string
    required: false,
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
  profileImage: { 
    type: String,
    required: false,
  }, 
  backgroundImage: { 
    type: String ,
    required: false,
  }, 
  headline: {
    type: String,
    required: false,
  },
  pronouns: {
    type: String,
    required: false,
  },
  industry: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Employer', employerSchema);