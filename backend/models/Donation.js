const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'hostel',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Books', 'Uniforms', 'Electronics', 'Furniture', 'Others']
    },
    description: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true,
        enum: ['New', 'Like New', 'Good', 'Fair']
    },
    status: {
        type: String,
        default: 'available',
        enum: ['available', 'claimed']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('donation', DonationSchema); 