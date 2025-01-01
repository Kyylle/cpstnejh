const Employer = require('../models/employer');
const Job = require('../models/Job');
const Jobseeker = require('../models/jobseeker');
const Content = require('../models/content');

// Search Controller
exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Case-insensitive regex for searching
    const searchRegex = new RegExp(query, 'i');

    // Search across all collections
    const [employers, jobs, jobseekers, content] = await Promise.all([
      Employer.find({
        $or: [
          { companyName: searchRegex },
          { description: searchRegex },
          { industry: searchRegex },
          { location: searchRegex },
        ],
      }),
      Job.find({
        $or: [
          { jobTitle: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { jobType: searchRegex },
        ],
      }).populate('employer'),
      Jobseeker.find({
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { location: searchRegex },
          { skills: searchRegex },
        ],
      }),
      Content.find({
        $or: [
          { caption: searchRegex },
          { 'comments.text': searchRegex },
        ],
      }).populate('employer'),
    ]);

    // Combine results
    const results = {
      employers,
      jobs,
      jobseekers,
      content,
    };

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Case-insensitive regex for searching
    const searchRegex = new RegExp(query, 'i');

    // Search in Employer and Jobseeker collections
    const [employers, jobseekers] = await Promise.all([
      Employer.find({
        $or: [
          { companyName: searchRegex },
          { description: searchRegex },
          { industry: searchRegex },
          { location: searchRegex },
        ],
      }),
      Jobseeker.find({
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { location: searchRegex },
          { skills: searchRegex },
        ],
      }),
    ]);

    // Combine results
    const results = {
      employers,
      jobseekers,
    };

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'User search failed', details: err.message });
  }
};