import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/feeds.css'; // Ensure to style it like the example image

const Feeds = () => {
    const [feeds, setFeeds] = useState([]);
    const [commentValues, setCommentValues] = useState({}); // State to store comments for each post

    useEffect(() => {
        // Fetch feed data from backend
        const fetchFeeds = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Ensure token is available in localStorage
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                    },
                };

                const response = await axios.get('/api/auth/get-posts', config); // Adjust the endpoint to match your backend
                setFeeds(response.data);
            } catch (error) {
                console.error('Error fetching feeds:', error);
            }
        };
        fetchFeeds();
    }, []);

    // Handle like post
    const handleLikePost = async (postId) => {
        console.log('Liking post with ID:', postId); // Debugging log

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('/api/auth/like-post', { postId }, config);
            console.log('Post liked:', response.data);

            // Update the liked post in the feeds state
            const updatedFeeds = feeds.map(feed => {
                if (feed._id === postId) {
                    // Update the likes count
                    return { ...feed, likes: response.data.likes };
                }
                return feed;
            });
            setFeeds(updatedFeeds);
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };

    // Handle comment input changes
    const handleCommentChange = (postId, comment) => {
        setCommentValues(prevState => ({
            ...prevState,
            [postId]: comment,
        }));
    };

    // Handle comment post
    const handleCommentPost = async (postId) => {
        const comment = commentValues[postId];
        if (!comment || !comment.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('/api/auth/comment-post', { postId, comment }, config);
            console.log('Comment added:', response.data);

            // Update the post with the new comment in the feeds state
            const updatedFeeds = feeds.map(feed => {
                if (feed._id === postId) {
                    return { ...feed, comments: response.data.comments };
                }
                return feed;
            });
            setFeeds(updatedFeeds);
            setCommentValues(prevState => ({
                ...prevState,
                [postId]: '', // Clear the input field for that post after commenting
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className='js-feeds-container'>
            {/* Render the feeds dynamically */}
            <div className='js-feed-list'>
                {feeds.map((feed, index) => (
                    <div key={index} className='js-feed-item'>
                        <div className="js-feed-header">
                            <img
                                src={feed.employer?.profileImage || feed.jobseeker?.profileImage || '/default-profile.png'}
                                alt={feed.employer?.companyName || feed.jobseeker?.name}
                                className="js-feed-profile-image"
                            />
                            <div className="js-feed-details">
                                <h4 className="js-feed-name">
                                    {feed.employer?.companyName || feed.jobseeker?.name}
                                </h4>
                                <p className="js-feed-date">
                                    {new Date(feed.postedDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="js-feed-caption">
                            <p>{feed.caption}</p>
                        </div>

                        {/* Media */}
                        {feed.media && feed.media.length > 0 && (
                            <div className="js-feed-media">
                                {feed.media.map((mediaUrl, i) => (
                                    <img
                                        key={i}
                                        src={mediaUrl}
                                        alt={`Media ${i + 1}`}
                                        className="js-feed-media-image"
                                    />
                                ))}
                            </div>
                        )}

                        {/* Like & Comment Section */}
                        <div className="js-feed-actions">
                            <button onClick={() => handleLikePost(feed._id)} className="js-like-btn">
                                👍 Like ({feed.likes.length})
                            </button>
                            <span>Comments ({feed.comments.length})</span>
                        </div>

                        {/* Comments Section */}
                        <div className="js-feed-comments">
                            {feed.comments.map((comment, i) => (
                                <div key={i} className="js-feed-comment">
                                    <p><strong>{comment.commenterName}</strong>: {comment.text}</p>
                                </div>
                            ))}

                            {/* Add New Comment */}
                            <div className="js-add-comment-section">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentValues[feed._id] || ''} // Get comment value for that specific post
                                    onChange={(e) => handleCommentChange(feed._id, e.target.value)}
                                />
                                <button
                                    onClick={() => handleCommentPost(feed._id)}
                                    disabled={!commentValues[feed._id] || !commentValues[feed._id].trim()} // Disable button if comment is empty
                                    className={!commentValues[feed._id] || !commentValues[feed._id].trim() ? 'disabled-btn' : ''} // Add a class for disabled button styling
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
