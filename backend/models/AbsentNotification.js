const mongoose = require('mongoose');

const absentNotificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('AbsentNotification', absentNotificationSchema); 