const mongoose = require('mongoose');

const jobseekerSchema = new mongoose.Schema({
    name: { type: String },  // Optional if Google doesn't provide
    email: { type: String, required: true, unique: true },
    password: { type: String },  // Only for traditional email sign-up
    firebaseUid: { type: String, unique: true }  // Unique identifier for Google users
});

module.exports = mongoose.model('Jobseeker', jobseekerSchema);
