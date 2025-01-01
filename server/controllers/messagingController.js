const Message = require('../models/message');
const asyncHandler = require('express-async-handler');
const { getIo } = require('../socket'); // Import Socket.IO instance
const Employer = require('../models/employer');
const Jobseeker = require('../models/jobseeker');
const Joi = require('joi');
const mongoose = require('mongoose');

const sendMessageSchema = Joi.object({
    content: Joi.string().min(1).required(),
    toId: Joi.string().required(),
});


// Helper function to determine the user type (Jobseeker or Employer)
const determineUserType = async (userId) => {
    const user = await Jobseeker.findById(userId) || await Employer.findById(userId);
    if (!user) throw new Error('Invalid user ID: User not found.');
    return user instanceof Jobseeker ? 'Jobseeker' : 'Employer';
};

exports.validateSendMessage = (req, res, next) => {
    const { error } = sendMessageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
    const { content, toId } = req.body;
    const fromId = req.user.userId; // Assuming user ID is stored in req.user

    if (!content || !fromId || !toId) {
        return res.status(400).json({ error: 'All fields are required: content, fromId, and toId.' });
    }

    try {
        const [fromType, toType] = await Promise.all([
            determineUserType(fromId),
            determineUserType(toId),
        ]);

        const message = await Message.create({
            content,
            from: { id: fromId, type: fromType },
            to: { id: toId, type: toType },
        });

        // Emit message using Socket.IO
        const io = getIo();
        io.to(toId).emit('receiveMessage', message);

        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Get messages for a user
exports.getMessages = asyncHandler(async (req, res) => {
    const { userId, limit = 10, page = 1 } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required as a query parameter.' });
    }

    const skip = (page - 1) * limit;

    try {
        const messages = await Message.find({
            $or: [{ 'from.id': userId }, { 'to.id': userId }],
        })
            .populate('from.id to.id', 'name email companyName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalMessages = await Message.countDocuments({
            $or: [{ 'from.id': userId }, { 'to.id': userId }],
        });

        res.status(200).json({
            messages,
            totalMessages,
            totalPages: Math.ceil(totalMessages / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});


// Handle real-time messages with Socket.IO
exports.setupSocketHandlers = (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Listen for incoming messages
    socket.on('sendMessage', async ({ content, toId }) => {
        const fromId = socket.userId; // Assuming the user ID is stored in the socket session

        if (!content || !fromId || !toId) {
            return socket.emit('error', { message: 'All fields are required: content, fromId, and toId.' });
        }

        try {
            const [fromType, toType] = await Promise.all([
                determineUserType(fromId),
                determineUserType(toId),
            ]);

            const message = await Message.create({
                content,
                from: { id: fromId, type: fromType },
                to: { id: toId, type: toType },
            });

            const io = getIo();
            io.to(toId).emit('receiveMessage', message); // Emit the message to the recipient
            socket.emit('messageSent', message); // Acknowledge the sender

        } catch (error) {
            console.error('Error processing sendMessage:', error);
            socket.emit('error', { message: 'Failed to send message', details: error.message });
        }
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
};


exports.markAsRead = asyncHandler(async (req, res) => {
    const { messageId } = req.body;

    if (!messageId) {
        return res.status(400).json({ error: 'messageId is required.' });
    }

    try {
        const message = await Message.findByIdAndUpdate(
            messageId,
            { read: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        const io = getIo();
        io.to(message.from.id).emit('messageRead', message);

        res.status(200).json({ message });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// exports.getConversations = asyncHandler(async (req, res) => {
//     const { userId } = req.query;

//     if (!userId) {
//         return res.status(400).json({ error: 'userId is required as a query parameter.' });
//     }

//     try {
//         // Aggregate messages to group by conversation pairs and get the latest message for each
//         const conversations = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { 'from.id': userId },
//                         { 'to.id': userId },
//                     ],
//                 },
//             },
//             {
//                 $sort: { createdAt: -1 }, // Sort messages by most recent first
//             },
//             {
//                 $group: {
//                     _id: {
//                         participantA: '$from.id',
//                         participantB: '$to.id',
//                     },
//                     latestMessage: { $first: '$$ROOT' },
//                 },
//             },
//             {
//                 $project: {
//                     participants: ['$_id.participantA', '$_id.participantB'],
//                     latestMessage: 1,
//                 },
//             },
//         ]);

//         // Transform the conversations to include details of the other participant
//         const populatedConversations = await Promise.all(
//             conversations.map(async (conversation) => {
//                 const { participants, latestMessage } = conversation;
//                 const otherParticipantId = participants.find((id) => id !== userId);

//                 const otherParticipant =
//                     (await Jobseeker.findById(otherParticipantId, 'name email')) ||
//                     (await Employer.findById(otherParticipantId, 'name email companyName'));

//                 return {
//                     otherParticipant,
//                     latestMessage,
//                 };
//             })
//         );

//         res.status(200).json({ conversations: populatedConversations });
//     } catch (error) {
//         console.error('Error fetching conversations:', error);
//         res.status(500).json({ error: 'Internal server error', details: error.message });
//     }
// });


exports.getConversations = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required as a query parameter.' });
    }

    try {
        // Convert userId to an ObjectId explicitly
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch distinct conversation pairs for the user
        const conversationParticipants = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { 'from.id': userObjectId },
                        { 'to.id': userObjectId },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        participantA: '$from.id',
                        participantB: '$to.id',
                    },
                },
            },
        ]);

        // Prepare the conversation list with participants and their full messages
        const conversations = await Promise.all(
            conversationParticipants.map(async ({ _id }) => {
                const participants = [_id.participantA, _id.participantB];
                const otherParticipantId = participants.find(
                    (id) => id.toString() !== userObjectId.toString()
                );

                // Fetch user details (Jobseeker or Employer)
                const otherParticipant =
                    (await Jobseeker.findById(otherParticipantId, 'name email')) ||
                    (await Employer.findById(otherParticipantId, 'name email companyName'));

                // Fetch all messages between the user and the other participant
                const messages = await Message.find({
                    $or: [
                        { 'from.id': userObjectId, 'to.id': otherParticipantId },
                        { 'from.id': otherParticipantId, 'to.id': userObjectId },
                    ],
                }).sort({ createdAt: 1 }); // Sort messages by oldest first

                // Return conversation data
                return {
                    otherParticipant,
                    messages,
                };
            })
        );

        res.status(200).json({ conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
