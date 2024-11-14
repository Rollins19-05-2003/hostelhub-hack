const express = require('express');
const router = express.Router();
const { getNotificationsByStudentId, markAsRead } = require('../controllers/notificationController');

router.post('/get-notifications-by-student-id', getNotificationsByStudentId);
router.post('/mark-as-read', markAsRead);

module.exports = router;