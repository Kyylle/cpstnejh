const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'followerModel', 
    required: true 
  }, // Person/entity doing the following
  followerModel: { 
    type: String, 
    enum: ['Jobseeker', 'Employer'], // Dynamic ref to Jobseeker or Employer
    required: true 
  },
  following: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'followingModel', 
    required: true 
  }, // Person/entity being followed
  followingModel: { 
    type: String, 
    enum: ['Jobseeker', 'Employer'], // Include both versions
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Follow', followSchema);
