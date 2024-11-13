const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParentRequestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    children_ids: {
        type: [Number],  // Array of student IDs
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = ParentRequest = mongoose.model('parentRequest', ParentRequestSchema); 