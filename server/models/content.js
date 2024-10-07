const mongoose = require('mongoose');


const contentSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer', // Reference to the employer who posted the content
    required: true,
  },
  caption: {
    type: String,
    required: false,
  },
  postedDate: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
  },
  media: {
    type: [String], // Array of strings to store media file paths (images/videos)
    required: false, // Optional, some posts might not have media
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType', // Reference to either Employer or Jobseeker
      },
      userType: {
        type: String,
        enum: ['Employer', 'Jobseeker'], // Specifies if the user is an employer or jobseeker
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType', // Reference to either Employer or Jobseeker
      },
      userType: {
        type: String,
        enum: ['Employer', 'Jobseeker'], // Specifies if the user is an employer or jobseeker
      },
      text: {
        type: String,
        required: true, // Comment text is required
      },
      date: {
        type: Date,
        default: Date.now, // Automatically set the date of the comment
      },
    },
  ],
});

module.exports = mongoose.model('Content', contentSchema);
