const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    from: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'from.type' },
        type: { type: String, required: true, enum: ['Jobseeker', 'Employer'] } // Differentiate user types
    },
    to: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'to.type' },
        type: { type: String, required: true, enum: ['Jobseeker', 'Employer'] }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
