import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavigationJobseeker from "./Navigation";

const ViewProfile = () => {
  const { type, id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("posts"); // Default view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const endpoint =
          type === "employer"
            ? `/api/auth/employer/${id}`
            : `/api/auth/jobseeker/${id}`;

        const response = await axios.get(endpoint, config);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [type, id]);

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-8 text-red-500">Profile not found.</p>;

  const handleViewChange = (newView) => setView(newView);

  const handleMessageClick = () => {
    navigate(`/messaging`, {
      state: {
        recipientId: profile.id,
        recipientName: profile.name || profile.companyName,
      },
    });
  };

  return (
    <div>
      <NavigationJobseeker />
      <div className="bg-gray-50 min-h-screen">
        {/* Profile Banner */}
        <div className="relative h-48 bg-cover bg-center" 
          style={{ backgroundImage: `url(${profile?.employer?.backgroundImage || '/default-background.png'})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Profile Header */}
        <div className="container mx-auto p-4 -mt-20">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <img
                src={profile?.employer?.profileImage || '/default-profile.png'}
                alt={profile?.employer?.companyName}
                className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white shadow-md"
              />
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {profile?.employer?.companyName || "Company Name"}
                </h2>
                <p className="text-gray-600">{profile?.employer?.location || "Location not specified"}</p>
                <p className="text-gray-500 text-sm">{profile?.employer?.industry || "Industry not specified"}</p>
                <p className="text-gray-700 mt-2">{profile?.employer?.description || "No description available."}</p>
              </div>
            </div>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                + Follow
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                onClick={handleMessageClick}
              >
                Message
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600">
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Toggle View Buttons */}
        <div className="container mx-auto mt-6 flex justify-center space-x-4">
          <button
            className={`px-6 py-2 text-sm font-semibold rounded-lg ${
              view === "posts"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleViewChange("posts")}
          >
            Posts
          </button>
          <button
            className={`px-6 py-2 text-sm font-semibold rounded-lg ${
              view === "jobs"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleViewChange("jobs")}
          >
            Jobs
          </button>
        </div>

        {/* View Content */}
        <div className="container mx-auto mt-6">
          {view === "posts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.posts && profile.posts.length > 0 ? (
                profile.posts.map((post) => (
                  <div key={post._id} className="bg-white shadow-lg rounded-lg p-4">
                    <p className="text-lg font-semibold">{post.caption}</p>
                    <p className="text-sm text-gray-500">
                      Posted on: {new Date(post.postedDate).toLocaleDateString()}
                    </p>
                    {post.media?.length > 0 && (
                      <img
                        src={post.media[0]}
                        alt="Post media"
                        className="mt-2 rounded-md"
                      />
                    )}
                    <p className="mt-2 text-gray-600">{post.likes.length} Likes</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No posts available.</p>
              )}
            </div>
          )}
          {view === "jobs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.jobs && profile.jobs.length > 0 ? (
                profile.jobs.map((job) => (
                  <div key={job._id} className="bg-white shadow-lg rounded-lg p-4">
                    <h4 className="text-lg font-bold">{job.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{job.location}</p>
                    <p className="text-gray-500 mt-2">{job.description}</p>
                    <p className="text-sm text-gray-500">
                      Salary: {job.salaryRange || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Deadline:{" "}
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No jobs available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
