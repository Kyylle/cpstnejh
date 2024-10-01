const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobseekerProfileSchema = new Schema({
  jobseeker: { type: Schema.Types.ObjectId, ref: 'Jobseeker', required: true }, // Reference to the Jobseeker schema
  bio: { type: String, required: false },
  location: { type: String, required: false },
  website: { type: String, required: false },
  experience: [{
    title: { type: String, required: false },
    company: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false }
  }],
  skills: [{ type: String }],
  education: [{
    institution: { type: String, required: false },
    degree: { type: String, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false }
  }],
  profileImage: { type: String, required: false },
  backgroundImage: { type: String, required: false }
});

module.exports = mongoose.model('JobseekerProfile', jobseekerProfileSchema);
