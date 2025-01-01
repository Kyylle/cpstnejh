import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./css/feeds.css";

const Feeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentValues, setCommentValues] = useState({});
  const [loadingPosts, setLoadingPosts] = useState({}); // Tracks loading state for each like/unlike action

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get("/api/auth/get-posts", config);
        setFeeds(response.data);

        // Initialize likedPosts based on user's existing likes
        const likedPostsSet = new Set(
          response.data
            .filter((feed) => feed.likes.includes(/* current user ID */))
            .map((feed) => feed._id)
        );
        setLikedPosts(likedPostsSet);
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    fetchFeeds();
  }, []);

  const handleLikeToggle = async (postId) => {
    if (loadingPosts[postId]) return;

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const isLiked = likedPosts.has(postId);
      const endpoint = isLiked
        ? "/api/auth/unlike-post"
        : "/api/auth/like-post";

      // Set loading state for the specific post
      setLoadingPosts((prev) => ({ ...prev, [postId]: true }));

      // Send the API request
      const response = await axios.post(endpoint, { postId }, config);

      if (response.status === 200) {
        const updatedLikes = response.data.likes;

        // Update "feeds" state to reflect the new likes
        setFeeds((prevFeeds) =>
          prevFeeds.map((feed) =>
            feed._id === postId ? { ...feed, likes: updatedLikes } : feed
          )
        );

        // Update "likedPosts" state
        setLikedPosts((prevLikedPosts) => {
          const updatedLikedPosts = new Set(prevLikedPosts);
          if (isLiked) {
            updatedLikedPosts.delete(postId);
          } else {
            updatedLikedPosts.add(postId);
          }
          return updatedLikedPosts;
        });
      } else {
        console.error("Failed to toggle like:", response.data);
      }
    } catch (error) {
      console.error(`Error toggling like for post ${postId}:`, error);
    } finally {
      // Reset loading state for the specific post
      setLoadingPosts((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentChange = (postId, comment) => {
    setCommentValues((prevState) => ({
      ...prevState,
      [postId]: comment,
    }));
  };

  const handleCommentPost = async (postId) => {
    const comment = commentValues[postId];
    if (!comment || !comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        "/api/auth/comment-post",
        { postId, comment },
        config
      );

      const updatedFeeds = feeds.map((feed) =>
        feed._id === postId
          ? { ...feed, comments: response.data.comments }
          : feed
      );
      setFeeds(updatedFeeds);
      setCommentValues((prevState) => ({
        ...prevState,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="shadow-sm rounded-lg">
      <div className="divide-y divide-gray-200">
        {feeds.map((feed, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4"
          >
            {/* Feed Header */}
            <div className="flex items-center space-x-4">
              <Link
                to={`/viewProfile/${feed.employer ? "employer" : "jobseeker"}/${
                  feed.employer?._id || feed.jobseeker?._id
                }`}
                className="flex items-center"
              >
                <img
                  src={
                    feed.employer?.profileImage ||
                    feed.jobseeker?.profileImage ||
                    "/default-profile.png"
                  }
                  alt={feed.employer?.companyName || feed.jobseeker?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-800 ml-2">
                    {feed.employer?.companyName || feed.jobseeker?.name}
                  </h4>
                  <p className="text-sm text-gray-500 ml-2">
                    {new Date(feed.postedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            </div>

            {/* Feed Content */}
            <div>
              <p className="text-gray-800">{feed.caption}</p>
              {feed.media && feed.media.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feed.media.map((mediaUrl, i) => (
                    <img
                      key={i}
                      src={mediaUrl}
                      alt={`Media ${i + 1}`}
                      className="w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Feed Actions */}
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <button
                onClick={() => handleLikeToggle(feed._id)}
                disabled={loadingPosts[feed._id]} // Disable button during loading
                className={`flex items-center ${
                  likedPosts.has(feed._id)
                    ? "text-blue-600 font-bold" // Active state
                    : "text-gray-500 hover:text-blue-600" // Default state
                }`}
              >
                <FaThumbsUp
                  className={`mr-2 ${
                    likedPosts.has(feed._id) ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                {feed.likes.length}
              </button>

              <span className="text-gray-500">
                Comments {feed.comments.length}
              </span>
            </div>

            {/* Comments */}
            <div className="mt-4 space-y-3">
              {feed.comments.map((comment, i) => (
                <div key={i} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <img
                      src={"/jobseekerProfileUploads/1732891098884.png"} // Static profile image
                      alt={"hello"} // Static name
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="text-sm font-semibold">
                      {"hello"} {/* Static name */}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              ))}
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentValues[feed._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(feed._id, e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleCommentPost(feed._id)}
                  disabled={
                    !commentValues[feed._id] || !commentValues[feed._id].trim()
                  }
                  className="ml-2 px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feeds;
