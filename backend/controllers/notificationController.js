const { AbsentNotification } = require('../models');

exports.getNotificationsByStudentId = async (req, res) => {
  try {
    const { studentIds } = req.body;
    console.log(studentIds, "studentIds")
    const notifications = await AbsentNotification.find({student: {$in: studentIds}})

    // Filter out notifications where student doesn't match hostel
    const filteredNotifications = notifications.filter(notif => notif.student !== null);

    res.json({
      success: true,
      notifications: filteredNotifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await AbsentNotification.findByIdAndUpdate(notificationId, { status: 'read' });
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 