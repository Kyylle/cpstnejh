import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa"; // Import the like (thumbs up) icon
import PostJob from "./PostJob";


const CompanyFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [commentValues, setCommentValues] = useState({});

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get("/api/auth/get-posts", config);
        setFeeds(response.data);
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    fetchFeeds();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        "/api/auth/like-post",
        { postId },
        config
      );

      const updatedFeeds = feeds.map((feed) => {
        if (feed._id === postId) {
          return { ...feed, likes: response.data.likes };
        }
        return feed;
      });
      setFeeds(updatedFeeds);
    } catch (error) {
      console.error("Error liking the post:", error);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        "/api/auth/comment-post",
        { postId, comment },
        config
      );

      const updatedFeeds = feeds.map((feed) => {
        if (feed._id === postId) {
          return { ...feed, comments: response.data.comments };
        }
        return feed;
      });
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
      <PostJob />
      <div className="divide-y divide-gray-200">
        {feeds.map((feed, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-4"
          >
            {/* Feed Header */}
            <div className="flex items-center space-x-4">
              <img
                src={feed.employer.profileImage || "/default-profile.png"}
                alt={feed.employer.companyName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-800">
                  {feed.employer.companyName}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(feed.postedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
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
                onClick={() => handleLikePost(feed._id)}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                <FaThumbsUp className="mr-2" />
                Like ({feed.likes.length})
              </button>
              <span className="text-gray-500">
                Comments ({feed.comments.length})
              </span>
            </div>

            {/* Comments */}
            <div className="mt-4 space-y-3">
              {feed.comments.map((comment, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <p className="text-sm">
                    <strong>{comment.commenterName}</strong>: {comment.text}
                  </p>
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
                    !commentValues[feed._id] ||
                    !commentValues[feed._id].trim()
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

export default CompanyFeeds;
