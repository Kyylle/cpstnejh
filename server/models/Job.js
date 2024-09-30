const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'], 
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
    required: false, // Optional
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  applicationDeadline: {
    type: Date,
    required: false, // Optional
  },
  requirements: [
    {
      type: String,
    }
  ],
  responsibilities: [
    {
      type: String,
    }
  ],
  benefits: [
    {
      type: String,
    }
  ],
});

module.exports = mongoose.model('Job', jobSchema); // Correctly export the model
