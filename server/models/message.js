const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    from: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'fromType' },
        type: { type: String, required: true, enum: ['Jobseeker', 'Employer'] }
    },
    to: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'toType' },
        type: { type: String, required: true, enum: ['Jobseeker', 'Employer'] }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
