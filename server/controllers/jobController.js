const Job = require("../models/Job");
const Employer = require("../models/employer");

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
