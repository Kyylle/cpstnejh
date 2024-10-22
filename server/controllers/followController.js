const Follow = require('../models/follow');
const Jobseeker = require('../models/jobseeker');
const Employer = require('../models/employer');

exports.followAccount = async (req, res) => {
  const { followId, followModel } = req.body; // ID and type (Jobseeker/Employer) of who to follow
  const userId = req.user.userId; // ID of the logged-in user
  const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer'; // Determine if the follower is a jobseeker or employer

  try {
    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: userId,
      followerModel: userModel,
      following: followId,
      followingModel: followModel,
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'You are already following this account.' });
    }

    // Create a new follow entry
    const newFollow = new Follow({
      follower: userId,
      followerModel: userModel,
      following: followId,
      followingModel: followModel,
    });

    await newFollow.save();

    res.status(200).json({ message: 'Successfully followed the account', follow: newFollow });
  } catch (error) {
    console.error('Error following account:', error);
    res.status(500).json({ message: 'Server error while following account' });
  }
};

exports.unfollowAccount = async (req, res) => {
  const { followId, followModel } = req.body;
  const userId = req.user.userId;
  const userModel = req.user.role === 'jobseeker' ? 'Jobseeker' : 'Employer';

  try {
    const follow = await Follow.findOneAndDelete({
      follower: userId,
      followerModel: userModel,
      following: followId,
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
