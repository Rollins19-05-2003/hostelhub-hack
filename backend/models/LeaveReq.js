const mongoose = require('mongoose');

const LeaveReqSchema = new mongoose.Schema({
    student_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    }
})

module.exports = mongoose.model('LeaveReq', LeaveReqSchema);