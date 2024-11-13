const Maintenance = require('../models/Maintenance');
const { validationResult } = require('express-validator');

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
    try {
        const maintenanceRequests = await Maintenance.find()
            .populate('student', ['name', 'room_no'])
            .populate('hostel', ['name']);
        res.status(200).json({success: true, maintenanceRequests});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

exports.getStudentMaintenanceRequests = async (req, res) => {
    let success = false;
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success,
                message: "Student ID is required"
            });
        }

        const maintenanceRequests = await Maintenance.find({ student: id })
            .sort({ date: -1 }) // Sort by date, newest first
            .populate('student', ['name', 'room_no'])
            .populate('hostel', ['name']);

        success = true;
        res.status(200).json({
            success,
            maintenanceRequests
        });
    } catch (error) {
        res.status(500).json({
            success,
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.updateMaintenanceStatus = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }

    try {
        const { id, status } = req.body;
        
        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const maintenance = await Maintenance.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('student', ['name', 'room_no']);

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: "Maintenance request not found"
            });
        }

        success = true;
        res.json({
            success,
            maintenance,
            message: "Maintenance status updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}