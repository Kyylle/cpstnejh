const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userType: { type: String, enum: ['Jobseeker', 'Employer'], required: true },
    userReference: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType', required: true },
});

module.exports = mongoose.model('User', userSchema);
