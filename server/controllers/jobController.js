const Job = require("../models/Job");
const Employer = require("../models/employer");
const Application = require("../models/application")
// Post a new job
exports.postJob = async (req, res) => {
  try {
    const employerId = req.user.userId; // Assuming user is authenticated and has employer's ID in the JWT token
    const { jobTitle, description, jobType, location, salaryRange, applicationDeadline, requirements, responsibilities, benefits } = req.body;

    // Validate required fields
    if (!jobTitle || !description || !jobType || !location) {
      return res.status(400).json({ error: "Job title, description, job type, and location are required" });
    }

    // Find employer
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // Create a new job
    const newJob = new Job({
      employer: employerId,
      jobTitle,
      description,
      jobType,
      location,
      salaryRange,
      applicationDeadline,
      requirements,
      responsibilities,
      benefits,
    });

    // Save the job to the database
    await newJob.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};



exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'companyName email');
    
    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

// Get job posts by employer
exports.getJobsByEmployer = async (req, res) => {
  try {
    const employerId = req.user.userId; // Assuming authenticated employer

    // Find employer
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // Find jobs posted by this employer
    const jobs = await Job.find({ employer: employerId });

    res.status(200).json({
      message: `Jobs posted by ${employer.companyName}`,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching employer's jobs:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};


//get applied jobs
exports.getAppliedJobs = async (req, res) => {
    try {
        const jobseekerId = req.user._id; // Assumes user ID is stored in req.user by your auth middleware

        // Fetch all applications for this jobseeker with job and employer details populated
        const applications = await Application.find({ jobseeker: jobseekerId }).populate({
            path: 'job',
            populate: { path: 'employer', model: 'Employer' } // Assuming Employer model exists
        });

        // Extract jobs from the applications
        const jobs = applications.map(application => application.job);

        res.json(jobs);
    } catch (error) {
        console.error('Failed to fetch applied jobs:', error);
        res.status(500).json({ message: 'Server error while fetching jobs' });
    }
};

exports.getEmployerApplications = async (req, res) => {
  try {
      // Use userId provided by your authentication middleware
      const employerId = req.user.userId;

      // Fetch all jobs posted by this employer
      const jobs = await Job.find({ employer: employerId });

      // Extract job IDs to search for applications
      const jobIds = jobs.map(job => job._id);

      // Fetch all applications that have been submitted to these jobs
      const applications = await Application.find({ job: { $in: jobIds } })
          .populate('jobseeker', 'name email') // Populate jobseeker details you want to show
          .populate({
              path: 'job',
              populate: { path: 'employer', select: 'companyName' } // Populate employer details if needed
          });

      // Map over applications to customize the response and ensure email is included
      const formattedApplications = applications.map(app => ({
          _id: app._id,
          jobseekerName: app.jobseeker.name,
          jobseekerEmail: app.jobseeker.email, // This assumes email is being populated from the jobseeker ref
          applicationEmail: app.email, // This is the direct application email if different from jobseeker's email
          jobTitle: app.job.title,
          companyName: app.job.employer.companyName,
          resume: app.resume,
          coverLetter: app.coverLetter,
          status: app.status,
          appliedDate: app.appliedDate,
          updatedDate: app.updatedDate
      }));

      res.json(formattedApplications);
  } catch (error) {
      console.error('Failed to fetch applications for the employer:', error);
      res.status(500).json({ message: 'Server error while fetching applications' });
  }
};
