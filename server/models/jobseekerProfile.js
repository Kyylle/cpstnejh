const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Profile Schema
const profileSchema = new Schema({
    jobseeker: { type: Schema.Types.ObjectId, ref: 'Jobseeker', required: true },
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
    }]
});

module.exports = mongoose.model('Profile', profileSchema);
