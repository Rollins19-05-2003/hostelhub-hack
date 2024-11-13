const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaintenanceSchema = new Schema({
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
    type: {
        type: String,
        required: true,
        enum: ['Cleaning', 'Electrical Work', 'WiFi Technical Support', 'Carpentry', 'Plumbing', 'AC Repair', 'Other']
    },
    room_no: {
        type: String,
        required: true
    },
    time_slot: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Maintenance = mongoose.model('maintenance', MaintenanceSchema);
