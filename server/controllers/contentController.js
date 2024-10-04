const Content = require('../models/content');
const Employer = require('../models/employer'); // Include the Employer model

// Post content (picture, video, caption) by Employer only
// exports.postContent = async (req, res) => {
//     try {
//       // Log req.user to check if it's populated correctly
//       console.log("Request user:", req.user);
  
//       const employerId = req.user.userId; // Extract employer ID from JWT token
  
//       // Find employer in the database
//       const employer = await Employer.findById(employerId);
//       if (!employer) {
//         return res.status(404).json({ error: "Employer not found" });
//       }
  
//       const { caption } = req.body;
  
//       // Check if files were uploaded
//       const mediaFiles = req.files ? req.files.map(file => `/contentuploads/${file.filename}`) : [];
  
//       // Create a new content post
//       const newContent = new Content({
//         employer: employerId,
//         caption,
//         media: mediaFiles, // Array of media file URLs
//       });
  
//       // Save the content post to the database
//       await newContent.save();
  
//       res.status(201).json({
//         message: "Content posted successfully",
//         content: newContent,
//       });
//     } catch (error) {
//       console.error("Error posting content:", error);
//       res.status(500).json({ error: "An internal server error occurred" });
//     }
//   };
exports.postContent = async (req, res) => {
  try {
    const employerId = req.user.userId; // Extract employer ID from the JWT payload (set by protect middleware)

    // Validate input
    const { caption } = req.body;
    if (!caption) {
      return res.status(400).json({ message: "Caption is required" });
    }

    // Ensure employer exists (optional validation)
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // Get the current date and time
    const postedDate = new Date();

    // Check if any files (images) were uploaded
    let mediaFiles = [];
    if (req.files && req.files.length > 0) {
      mediaFiles = req.files.map(file => `/contentuploads/${file.filename}`); // Get file paths for the uploaded images
    }

    // Create new content with caption, media files, and the current date/time
    const newContent = new Content({
      employer: employerId,
      caption, // Only posting text content
      media: mediaFiles, // Array of uploaded media file paths
      postedDate, // Automatically set the current date and time
    });

    // Save the content to the database
    await newContent.save();

    res.status(201).json({
      message: "Content posted successfully",
      content: newContent,
    });
  } catch (error) {
    console.error("Error posting content:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};


// Like a post (both employers and jobseekers)
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    // const userType = req.user.userType; // Extract userType (employer or jobseeker) from JWT

    // Debugging
    console.log("User ID:", userId);
    // console.log("User Type:", userType);

    const { postId } = req.body;

    // Find the content by its ID
    const content = await Content.findById(postId);

    if (!content) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const alreadyLiked = content.likes.find(like => like.user.toString() === userId);
    if (alreadyLiked) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    // Add the like with user ID and userType
    content.likes.push({ user: userId, userType });
    await content.save();

    res.status(200).json({ message: "Post liked", likes: content.likes });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};


// Comment on a post (both employers and jobseekers)
exports.commentOnPost = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from JWT
    const { postId, comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Find the content by its ID
    const content = await Content.findById(postId);

    if (!content) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the comment with user ID
    const newComment = {
      user: userId,
      text: comment,
      date: Date.now(),
    };

    content.comments.push(newComment);
    await content.save();

    res.status(201).json({ message: "Comment added", comments: content.comments });
  } catch (error) {
    console.error("Error commenting on post:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};


//get the posts content
exports.getPosts = async (req, res) => {
  try {
    // Find all posts (You can add pagination, filtering, or sorting if needed)
    const posts = await Content.find()
      .populate('employer', 'companyName profileImage') // Assuming you're fetching employer details for the post
      .sort({ postedDate: -1 }); // Sorting by the most recent posts

    res.status(200).json(posts); // Return the posts as JSON
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
};