const mongoose = require('mongoose');

const jobseekerSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

module.exports = mongoose.model('Jobseeker', jobseekerSchema);
