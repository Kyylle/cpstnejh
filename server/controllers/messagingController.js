const Message = require('../models/message');

// Send a message
exports.sendMessage = async (req, res) => {
    const { content, toId, toType } = req.body;
    const fromId = req.user._id;
    const fromType = req.user.userType;

    try {
        const message = new Message({
            content,
            from: { id: fromId, type: fromType },
            to: { id: toId, type: toType }
        });
        await message.save();
        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch messages for a user
exports.getMessages = async (req, res) => {
    const userId = req.user._id;
    const userType = req.user.userType;

    try {
        const messages = await Message.find({
            $or: [
                { 'from.id': userId, 'from.type': userType },
                { 'to.id': userId, 'to.type': userType }
            ]
        }).populate('from.id to.id', 'username email companyName name');
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
