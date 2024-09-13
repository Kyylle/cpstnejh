const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true }, // Field to store Firebase UID
    companyName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Employer', employerSchema);
