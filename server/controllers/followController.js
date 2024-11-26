const Follow = require('../models/follow');
const Jobseeker = require('../models/jobseeker');
const Employer = require('../models/employer');
const mongoose = require('mongoose');


exports.followAccount = async (req, res) => {
  const { followModel } = req.body;
  const userId = req.user.userId; // ID of the user making the request
  const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

  // Validate input
  if (!followModel) {
    return res.status(400).json({ message: 'Missing followModel' });
  }

  try {
    console.log('Received follow request:', { followModel, userId, userModel });

    // Find the target account to follow
    const targetAccount = await mongoose.model(followModel).findOne(); // Fetch a default account for the model
    if (!targetAccount) {
      return res.status(400).json({ message: `No ${followModel} found to follow` });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: userId,
      followerModel: userModel,
      following: targetAccount._id,
      followingModel: followModel,
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'You are already following this account.' });
    }

    // Create a new follow entry
    const newFollow = new Follow({
      follower: userId,
      followerModel: userModel,
      following: targetAccount._id,
      followingModel: followModel,
    });

    await newFollow.save();

    res.status(200).json({ message: 'Successfully followed the account', follow: newFollow });
  } catch (error) {
    console.error('Error following account:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    }
    res.status(500).json({ message: 'Server error while following account' });
  }
};


exports.unfollowAccount = async (req, res) => {
  const { followModel } = req.body;
  const userId = req.user.userId;
  const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

  try {
    const follow = await Follow.findOneAndDelete({
      follower: userId,
      followerModel: userModel,
      followingModel: followModel,
    });

    if (!follow) {
      return res.status(400).json({ message: 'You are not following this account.' });
    }

    res.status(200).json({ message: 'Successfully unfollowed the account' });
  } catch (error) {
    console.error('Error unfollowing account:', error);
    res.status(500).json({ message: 'Server error while unfollowing account' });
  }
};

exports.checkFollowingStatus = async (req, res) => {
  const { followModel } = req.query;
  const userId = req.user.userId;

  try {
    const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

    const existingFollow = await Follow.findOne({
      follower: userId,
      followerModel: userModel,
      followingModel: followModel,
    });

    res.status(200).json({ isFollowing: !!existingFollow });
  } catch (error) {
    console.error('Error checking following status:', error);
    res.status(500).json({ message: 'Server error while checking following status' });
  }
};
