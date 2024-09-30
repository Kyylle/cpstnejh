const mongoose = require('mongoose');

// const contentSchema = new mongoose.Schema({
//   employer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Employer', // Only employers can create posts
//     required: true,
//   },
//   caption: {
//     type: String,
//     required: false,
//   },
//   media: {
//     type: [String], // Array of media file URLs (images/videos)
//     required: false,
//   },
//   postedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   likes: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType' }, // Reference to either Employer or Jobseeker
//       userType: { type: String, enum: ['Employer', 'Jobseeker'] }, // Track user type
//     }
//   ],
//   comments: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType' }, // Reference to either Employer or Jobseeker
//       userType: { type: String, enum: ['Employer', 'Jobseeker'] }, // Track user type
//       text: { type: String, required: true },
//       date: { type: Date, default: Date.now },
//     },
//   ],
// });
const contentSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer', // Reference to the employer who posted the content
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
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
