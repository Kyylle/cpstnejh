const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobseeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobseeker',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resume: { 
        type: String, // Stores the file path of the uploaded resume
        required: false
    },
    coverLetter: { 
        type: String, 
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedDate: { 
        type: Date, 
        default: Date.now 
    },
    updatedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
