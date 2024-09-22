const mongoose = require('mongoose');

const jobseekerSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Jobseeker', jobseekerSchema);
