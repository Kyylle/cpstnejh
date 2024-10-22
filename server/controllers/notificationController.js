const Notification = require('../models/notification');

exports.createNotification = async (req, res) => {
    try {
        const { userId, userType, message } = req.body;

        const newNotification = new Notification({
            userId,
            userType,
            message
        });

        await newNotification.save();

        res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming authentication middleware sets userId
        const userType = req.user.userType; // 'Jobseeker' or 'Employer'

        const notifications = await Notification.find({ userId, userType }).sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notifications', error: error.message });
    }
};


exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
    }
};
