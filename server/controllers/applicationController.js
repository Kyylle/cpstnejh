const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/application');
const Job = require('../models/Job');

// Multer setup in the controller
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'applications/resumes/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).single('resume'); // Expect a single resume file

// Controller for applying to a job
exports.applyToJob = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { jobId, coverLetter, email } = req.body; // Include email in the destructuring from req.body
            const userId = req.user.userId;

            // Find the job by jobId
            const job = await Job.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            // Check if the user has already applied for the job
            const existingApplication = await Application.findOne({
                jobseeker: userId,
                job: jobId,
            });

            if (existingApplication) {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }

            // Create a new job application with the uploaded resume file path and email
            const newApplication = new Application({
                jobseeker: userId,
                job: jobId,
                email: email, // Save the email provided in the application
                resume: req.file ? req.file.path : null, // Store the file path of the uploaded resume
                coverLetter: coverLetter || null,
            });

            await newApplication.save();

            res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};

