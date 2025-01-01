const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userType',  // Dynamically refer to either Employer or Jobseeker
    required: true,
  },
  userType: {
    type: String,
    enum: ['Employer', 'Jobseeker'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Model for Comment
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
