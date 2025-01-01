import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaUserFriends,
  FaBookmark,
  FaUsers,
} from 'react-icons/fa';
import { MdOutlineEventNote } from 'react-icons/md';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Token not found in localStorage');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/getJobseekerProfile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
      } catch (error) {
        console.error(
          'Error fetching profile data:',
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile data not available</div>;
  }

  return (
    <div className="overflow-hidden p-4">
      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src={profile.profileImage || 'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-12 h-12 rounded-full border border-gray-300"
        />
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {profile.name || 'Name not available'}
          </h3>
          <p className="text-sm text-gray-500">Jobseeker</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="space-y-4">
        {/* Education */}
        <div className="p-2 rounded-lg bg-gray-100">
          <h4 className="font-medium text-gray-700">Education</h4>
          {profile.education.length > 0 ? (
            <ul className="mt-2">
              {profile.education.map((edu, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {edu.degree} at {edu.school}, {edu.startYear} -{' '}
                  {edu.endYear || 'Present'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No education details available</p>
          )}
        </div>

        {/* Groups */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaUsers className="w-6 h-6 text-green-500" />
          <span className="ml-3 text-gray-700">Groups</span>
        </div>

        {/* Events */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <MdOutlineEventNote className="w-6 h-6 text-yellow-500" />
          <span className="ml-3 text-gray-700">Events</span>
        </div>

        {/* Saved Items */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaBookmark className="w-6 h-6 text-purple-500" />
          <span className="ml-3 text-gray-700">Saved</span>
        </div>

        {/* Friends */}
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition-all duration-300">
          <FaUserFriends className="w-6 h-6 text-orange-500" />
          <span className="ml-3 text-gray-700">Friends</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
