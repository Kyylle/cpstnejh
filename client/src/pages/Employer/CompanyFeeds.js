import React, { useEffect, useState } from "react";
import PostJob from "./PostJob";
import { fetchFeeds, likePost, commentPost } from './services/apiService'; // Import API service
import { fetchAllCommentersProfileImages } from './utils/profileHelpers'; // Import profile helper
import './css/companyFeeds.css';

const CompanyFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [commentValues, setCommentValues] = useState({});
  const [commentersProfileImages, setCommentersProfileImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFeeds();
        setFeeds(response.data);

        // Fetch all commenters' profile images
        await fetchAllCommentersProfileImages(response.data, setCommentersProfileImages);
      } catch (error) {
        console.error("Error fetching feeds:", error);
      }
    };
    fetchData();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      const response = await likePost(postId);
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

  const handleCommentPost = async (postId) => {
    const comment = commentValues[postId];
    if (!comment || !comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await commentPost(postId, comment);

      // Fetch profile images for the new comments
      await fetchAllCommentersProfileImages(response.data.comments, setCommentersProfileImages);

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
    <div className="company-page-content">
      <PostJob />
      <div className="feed-list">
        {feeds.map((feed, index) => (
          <div key={index} className="feed-item">
            <div className="feed-header">
              <img
                src={feed.employer.profileImage || "/default-profile.png"}
                alt={feed.employer.companyName}
                className="feed-profile-image"
              />
              <div className="feed-details">
                <h4 className="feed-company-name">{feed.employer.companyName}</h4>
                <p className="feed-date">
                  {new Date(feed.postedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="feed-caption">
              <p>{feed.caption}</p>
            </div>

            {feed.media && feed.media.length > 0 && (
              <div className="feed-media">
                {feed.media.map((mediaUrl, i) => (
                  <img
                    key={i}
                    src={mediaUrl}
                    alt={`Media ${i + 1}`}
                    className="feed-media-image"
                  />
                ))}
              </div>
            )}

            <div className="feed-actions">
              <button onClick={() => handleLikePost(feed._id)} className="like-btn">
                👍 Like ({feed.likes.length})
              </button>
              <span>Comments ({feed.comments.length})</span>
            </div>

            <div className="feed-comments">
              {feed.comments.map((comment, i) => (
                <div key={i} className="feed-comment">
                  <img
                    src={commentersProfileImages[comment.user]?.profileImage || "/default-profile.png"}
                    alt={commentersProfileImages[comment.user]?.name || "Anonymous"}
                    className="comment-profile-image"
                  />
                  <div className="comment-content">
                    <p className="commenter-name">
                      <strong>{commentersProfileImages[comment.user]?.name || "Anonymous"}</strong>
                    </p>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}

              <div className="add-comment-section">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentValues[feed._id] || ""}
                  onChange={(e) => setCommentValues({ ...commentValues, [feed._id]: e.target.value })}
                />
                <button
                  onClick={() => handleCommentPost(feed._id)}
                  disabled={!commentValues[feed._id] || !commentValues[feed._id].trim()}
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
