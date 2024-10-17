const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { getIo } = require('../socket'); // Import Socket.IO instance
const Employer = require('../models/employer');
const Jobseeker = require('../models/jobseeker');

// Helper function to determine the user type (Jobseeker or Employer)
const determineUserType = async (userId) => {
    let user = await Jobseeker.findById(userId);
    if (user) return 'Jobseeker'; // If found in Jobseeker, return 'Jobseeker'

    user = await Employer.findById(userId);
    if (user) return 'Employer'; // If found in Employer, return 'Employer'

    throw new Error('Invalid user ID: User not found.'); // If user not found, throw an error
};

// Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
    const { content, toId } = req.body; // Assume fromId is taken from req.user
    const fromId = req.user.userId; // Logged-in user's ID

    // Ensure required fields are present
    if (!content || !fromId || !toId) {
        return res.status(400).json({ error: 'All fields are required: content, fromId, and toId.' });
    }

    try {
        const fromType = await determineUserType(fromId); // Determine sender's type
        const toType = await determineUserType(toId); // Determine receiver's type

        // Create and save the message
        const message = new Message({
            content,
            from: { id: fromId, type: fromType },
            to: { id: toId, type: toType },
        });
        await message.save();

        // Emit the message using Socket.IO
        const io = getIo();
        io.to(toId).emit('receiveMessage', message);

        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error', details: error.toString() });
    }
});

// Get messages for a user
exports.getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.query; // User ID passed as a query parameter

    if (!userId) {
        return res.status(400).json({ error: 'userId is required as a query parameter.' });
    }

    try {
        const messages = await Message.find({
            $or: [{ 'from.id': userId }, { 'to.id': userId }],
        })
            .populate('from.id to.id', 'name email companyName') // Populate relevant user details
            .sort({ createdAt: -1 });

        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error', details: error.toString() });
    }
});
