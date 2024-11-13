const Maintenance = require('../models/Maintenance');

exports.submitMaintenanceRequest = async (req, res) => {
    const { student, hostel, type, room_no, time_slot, description } = req.body;
    const maintenance = new Maintenance({
        student,
        hostel,
        type,
        room_no,
        time_slot,
        description
    })
    await maintenance.save();
    res.status(200).json({success: true, "message": "Maintenance request submitted successfully"});
}

exports.getMaintenanceRequests = async (req, res) => {
    const maintenanceRequests = await Maintenance.find();
    res.status(200).json({success: true, maintenanceRequests});
}