const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userType: { type: String, enum: ['jobseeker', 'employer'], required: true }, // Ensure enum has correct values
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Notification', notificationSchema);
