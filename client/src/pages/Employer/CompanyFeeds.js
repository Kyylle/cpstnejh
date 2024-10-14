import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaThumbsUp } from 'react-icons/fa';  // Import the like (thumbs up) icon
import './css/companyFeeds.css'; // Ensure to style it like the example image
import PostJob from './PostJob';

const CompanyFeeds = () => {
    const [feeds, setFeeds] = useState([]);
    const [commentValues, setCommentValues] = useState({});

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get('/api/auth/get-posts', config);
                setFeeds(response.data);
            } catch (error) {
                console.error('Error fetching feeds:', error);
            }
        };
        fetchFeeds();
    }, []);

    const handleLikePost = async (postId) => {
        console.log('Liking post with ID:', postId);

        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('/api/auth/like-post', { postId }, config);
            console.log('Post liked:', response.data);

            const updatedFeeds = feeds.map(feed => {
                if (feed._id === postId) {
                    return { ...feed, likes: response.data.likes };
                }
                return feed;
            });
            setFeeds(updatedFeeds);
        } catch (error) {
            console.error('Error liking the post:', error);
        }
    };

    const handleCommentChange = (postId, comment) => {
        setCommentValues(prevState => ({
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
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('/api/auth/comment-post', { postId, comment }, config);
            console.log('Comment added:', response.data);

            const updatedFeeds = feeds.map(feed => {
                if (feed._id === postId) {
                    return { ...feed, comments: response.data.comments };
                }
                return feed;
            });
            setFeeds(updatedFeeds);
            setCommentValues(prevState => ({
                ...prevState,
                [postId]: '',
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className='company-page-content'>
            <PostJob />
            <div className='feed-list'>
                {feeds.map((feed, index) => (
                    <div key={index} className='feed-item'>
                        <div className="feed-header">
                            <img
                                src={feed.employer.profileImage || '/default-profile.png'}
                                alt={feed.employer.companyName}
                                className="feed-profile-image"
                            />
                            <div className="feed-details">
                                <h4 className="feed-company-name">{feed.employer.companyName}</h4>
                                <p className="feed-date">
                                    {new Date(feed.postedDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
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
                                <FaThumbsUp /> {/* Like icon */}
                                &nbsp;Like ({feed.likes.length}) {/* Like text and count */}
                            </button>
                            <span>Comments ({feed.comments.length})</span>
                        </div>

                        <div className="feed-comments">
                            {feed.comments.map((comment, i) => (
                                <div key={i} className="feed-comment">
                                    <p><strong>{comment.commenterName}</strong>: {comment.text}</p>
                                </div>
                            ))}

                            <div className="add-comment-section">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentValues[feed._id] || ''}
                                    onChange={(e) => handleCommentChange(feed._id, e.target.value)}
                                />
                                <button
                                    onClick={() => handleCommentPost(feed._id)}
                                    disabled={!commentValues[feed._id] || !commentValues[feed._id].trim()}
                                    className={!commentValues[feed._id] || !commentValues[feed._id].trim() ? 'disabled-btn' : ''}
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

