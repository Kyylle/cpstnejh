const Follow = require('../models/follow');
const Jobseeker = require('../models/jobseeker');
const Employer = require('../models/employer');
const mongoose = require('mongoose');


exports.followAccount = async (req, res) => {
  const { followModel, followingId } = req.body;
  const userId = req.user.userId;
  const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

  if (!followModel || !followingId) {
    return res.status(400).json({ message: 'Missing followModel or followingId' });
  }

  try {
    console.log('Received follow request:', { followModel, userId, userModel, followingId });

    const targetAccount = await mongoose.model(followModel).findById(followingId);
    if (!targetAccount) {
      return res.status(404).json({ message: `No ${followModel} found with the provided ID` });
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      followerModel: userModel,
      following: followingId,
      followingModel: followModel,
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this account' });
    }

    const newFollow = new Follow({
      follower: userId,
      followerModel: userModel,
      following: followingId,
      followingModel: followModel,
    });

    await newFollow.save();

    res.status(200).json({ message: 'Successfully followed the account', follow: newFollow });
  } catch (error) {
    console.error('Error following account:', error);
    res.status(500).json({ message: 'Server error while following the account' });
  }
};

exports.unfollowAccount = async (req, res) => {
  const { followModel, followingId } = req.body;
  const userId = req.user.userId;
  const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

  if (!followModel || !followingId) {
    return res.status(400).json({ message: 'Missing followModel or followingId' });
  }

  try {
    const follow = await Follow.findOneAndDelete({
      follower: userId,
      followerModel: userModel,
      following: followingId,
      followingModel: followModel,
    });

    if (!follow) {
      return res.status(400).json({ message: 'You are not following this account' });
    }

    res.status(200).json({ message: 'Successfully unfollowed the account' });
  } catch (error) {
    console.error('Error unfollowing account:', error);
    res.status(500).json({ message: 'Server error while unfollowing the account' });
  }
};



exports.checkFollowingStatus = async (req, res) => {
  const { followModel, targetId } = req.query; // Extract parameters
  const userId = req.user.userId; // Authenticated user ID

  if (!targetId || !followModel) {
    return res.status(400).json({ message: 'Missing followModel or targetId' });
  }

  try {
    const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

    // Check if the targetId is a valid ObjectId
    if (!targetId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid targetId format' });
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      followerModel: userModel,
      following: targetId,
      followingModel: followModel,
    });

    return res.status(200).json({ isFollowing: !!existingFollow });
  } catch (error) {
    console.error('Error checking following status:', error);
    return res.status(500).json({ message: 'Server error while checking following status' });
  }
};


// Controller to fetch followed accounts
// Controller to fetch followed accounts

exports.getFollowedAccounts = async (req, res) => {
  const userId = req.user.userId; // Get the logged-in user's ID
  const validModels = ["Employer", "Jobseeker"]; // Whitelisted models

  try {
    // Fetch followed accounts based on the user's follows
    const follows = await Follow.find({ follower: userId });

    const followedAccounts = await Promise.all(
      follows.map(async (follow) => {
        if (!validModels.includes(follow.followingModel)) return null; // Validate model type

        const targetAccount = await mongoose
          .model(follow.followingModel)
          .findById(follow.following)
          .select("name companyName profileImage"); // Fetch only required fields

        if (!targetAccount || targetAccount._id.toString() === userId) return null; // Skip if missing or the logged-in user

        return {
          id: targetAccount._id,
          name: targetAccount.name || targetAccount.companyName,
          avatar: targetAccount.profileImage,
        };
      })
    );

    res
      .status(200)
      .json({ followedAccounts: followedAccounts.filter(Boolean) }); // Filter out null entries
  } catch (error) {
    console.error("Error fetching followed accounts:", error);
    res.status(500).json({ message: "Server error while fetching followed accounts" });
  }
};




