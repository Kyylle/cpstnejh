import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import axios from "axios";
import ApplyJobModal from "./ApplyJobModal";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    experience: "",
    salaryRange: "",
    urgency: "",
  });

  useEffect(() => {
    axios
      .get("/api/auth/jobs")
      .then((response) => {
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      })
      .catch((err) => {
        setError("Failed to fetch job listings.");
        console.error("Error fetching jobs:", err);
      });
  }, []);

  const handleJobSelect = (job) => setSelectedJob(job);
  const handleApplyClick = () => selectedJob && setShowModal(true);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      applyFilters(newFilters);
      return newFilters;
    });
  };

  const applyFilters = (filters) => {
    let filtered = [...jobs];

    if (filters.experience) {
      filtered = filtered.filter(
        (job) => job.requiredExperience === filters.experience
      );
    }

    if (filters.salaryRange) {
      const { min, max } = getSalaryRange(filters.salaryRange);
      filtered = filtered.filter((job) => {
        if (job.salaryRange) {
          const [jobMin, jobMax] = job.salaryRange.split("-").map(Number);
          return jobMin >= min && jobMax <= max;
        }
        return false;
      });
    }

    if (filters.urgency) {
      filtered = filtered.filter((job) => job.urgency === filters.urgency);
    }

    setFilteredJobs(filtered);
  };

  const getSalaryRange = (range) => {
    switch (range) {
      case "lessThan10000":
        return { min: 0, max: 10000 };
      case "10000-20000":
        return { min: 10000, max: 20000 };
      case "20000-50000":
        return { min: 20000, max: 50000 };
      case "50000-100000":
        return { min: 50000, max: 100000 };
      case "moreThan100000":
        return { min: 100000, max: Infinity };
      default:
        return { min: 0, max: Infinity };
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen mt-16">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Section */}
          <aside className="bg-white shadow-md rounded-lg p-4 lg:w-1/4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Filters
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Experience
                </label>
                <select
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">All</option>
                  <option value="entry">Entry-Level</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior-Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Salary Range
                </label>
                <select
                  name="salaryRange"
                  value={filters.salaryRange}
                  onChange={handleFilterChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">All</option>
                  <option value="lessThan10000">Less than 10,000</option>
                  <option value="10000-20000">10,000 - 20,000</option>
                  <option value="20000-50000">20,000 - 50,000</option>
                  <option value="50000-100000">50,000 - 100,000</option>
                  <option value="moreThan100000">More than 100,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={filters.urgency}
                  onChange={handleFilterChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Job Listings Section */}
          <main className="lg:w-2/4">
            {error && <p className="text-red-600">{error}</p>}
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {job.jobTitle}
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        new Date(job.applicationDeadline) > new Date()
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {new Date(job.applicationDeadline) > new Date()
                        ? "Available"
                        : "Unavailable"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {job.employer?.companyName} • {job.location} • {job.jobType}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No jobs match your filters.</p>
            )}
          </main>

          {/* Job Details Section */}
          <aside className="bg-white shadow-md rounded-lg p-4 lg:w-1/4">
            {selectedJob ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedJob.jobTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedJob.employer?.companyName} • {selectedJob.location}
                </p>
                <p className="mb-2">
                  <strong>Salary:</strong>{" "}
                  {selectedJob.salaryRange || "Not provided"}
                </p>
                <p className="mb-2">
                  <strong>Deadline:</strong>{" "}
                  {selectedJob.applicationDeadline
                    ? new Date(
                        selectedJob.applicationDeadline
                      ).toLocaleDateString()
                    : "No deadline"}
                </p>
                <p className="mb-4">
                  <strong>Description:</strong> {selectedJob.description}
                </p>
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply Now
                </button>
              </>
            ) : (
              <p className="text-gray-600">Select a job to view details.</p>
            )}
          </aside>
        </div>

        {showModal && selectedJob && (
          <ApplyJobModal
            jobId={selectedJob._id}
            closeModal={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Job;
