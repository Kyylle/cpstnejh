import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../Navigation';


const EmployerInquiries = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

  const jobTitleColors = {};

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedJobTitle]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/auth/employer-applications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setApplications(response.data);

      const titles = ['All', ...new Set(response.data.map((app) => app.jobTitle))];
      setJobTitles(titles);

      titles.slice(1).forEach((title, index) => {
        const colors = ['#F9FAFB', '#E8F5E9', '#F3E5F5', '#E3F2FD', '#FFFDE7'];
        jobTitleColors[title] = colors[index % colors.length];
      });
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setError('Failed to load applications.');
    }
    setIsLoading(false);
  };

  const filterApplications = () => {
    if (selectedJobTitle === 'All') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(
        applications.filter((application) => application.jobTitle === selectedJobTitle)
      );
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `/api/auth/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
      setError('Failed to update application status.');
    }
  };

  const openModal = (resumeUrl) => {
    setModalContent(resumeUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-6 mt-16">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold mb-2">Job Applications</h2>
          <p className="text-gray-500 text-sm">
            Manage and review job applications submitted by jobseekers. Filter applications by job title, 
            view details, and update their status.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
        <label className="text-sm font-medium text-gray-700">Filter by Job Title:</label>
          <select
            value={selectedJobTitle}
            onChange={(e) => setSelectedJobTitle(e.target.value)}
            className="border p-2 rounded-md focus:ring focus:ring-blue-300"
          >
            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 text-sm uppercase font-bold">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Applied Date</th>
                  <th className="px-6 py-3">Resume</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application, index) => (
                  <tr
                    key={application._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{application.jobseekerName || 'N/A'}</td>
                    <td className="px-6 py-4">{application.jobseekerEmail || 'N/A'}</td>
                    <td
                      className="px-6 py-4"
                      style={{
                        backgroundColor: jobTitleColors[application.jobTitle],
                      }}
                    >
                      {application.jobTitle}
                    </td>
                    <td className="px-6 py-4">
                      {application.appliedDate
                        ? new Date(application.appliedDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {application.resume ? (
                        <button
                          onClick={() =>
                            openModal(`http://localhost:5000/${application.resume}`)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </button>
                      ) : (
                        'No resume'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={application.status || 'pending'}
                        onChange={(e) =>
                          handleStatusChange(application._id, e.target.value)
                        }
                        className="border rounded-md p-2 focus:ring focus:ring-blue-300"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No applications found for this job title.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3">
            <button
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
              onClick={closeModal}
            >
              X
            </button>
            {modalContent.endsWith('.pdf') ? (
              <iframe
                src={modalContent}
                width="100%"
                height="600px"
                title="Resume"
                className="border-none"
              ></iframe>
            ) : modalContent.endsWith('.jpg') ||
              modalContent.endsWith('.jpeg') ||
              modalContent.endsWith('.png') ? (
              <img
                src={modalContent}
                alt="Resume Preview"
                className="w-full h-auto"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
            ) : (
              <p>Unsupported file type</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerInquiries;
