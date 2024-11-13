const { validationResult } = require('express-validator');
const { LeaveForm, Student } = require('../models/');

exports.requestLeave = async (req, res) => {
    console.log(req.body);
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({"message": errors.array(), success});
    }
    const { student, leaving_date, return_date } = req.body;
    const today = new Date();
    if (new Date(leaving_date) > new Date(return_date)) {
        return res.status(400).json({success, "message": "Leaving date cannot be greater than return date"});
    }
    else if (new Date(leaving_date) < today) {
        return res.status(400).json({success, "message": "Request cannot be made for past leave off"});
    }
    try {
        const leaveForm = new LeaveForm({
            student,
            leaving_date,
            return_date
        });
        await leaveForm.save();
        success = true;
        return res.status(200).json({ success, "message": "Leave request sent successfully" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, "message": "Server Error" });
    }
}


exports.countLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }
    const { student } = req.body;
    try {
        let date = new Date();
        const list = await LeaveForm.find({ student, leaving_date: { $gte: new Date(date.getFullYear(), date.getMonth(), 1), $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0) } });
        let approved = await LeaveForm.find({student, status: "Approved", leaving_date: {$gte: new Date(date.getFullYear(), date.getMonth(), 1), $lte: new Date(date.getFullYear(), date.getMonth()+1, 0)}});
        
        let days = 0;
        for (let i = 0; i < approved.length; i++) {
            days += (new Date(approved[i].return_date) - new Date(approved[i].leaving_date))/(1000*60*60*24);
        }

        approved = days;

        success = true;
        return res.status(200).json({success, list, approved});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, "message": "Server Error" });
    }
}


exports.listLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), success});
    }
    const { hostel } = req.body;
    try {
        const students = await Student.find({ hostel }).select('_id');
        const list = await LeaveForm.find({ student: { $in: students } , status: "pending" }).populate('student', ['name', 'room_no']);
        const approved = await LeaveForm.countDocuments({ student: { $in: students }, status: "approved", leaving_date: {$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lte: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)}});
        const rejected = await LeaveForm.countDocuments({ student: { $in: students }, status: "rejected", leaving_date: {$gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lte: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)}});
        success = true;
        return res.status(200).json({success, list, approved, rejected});
    }
    catch (err) {
        // console.error(err.message);
        return res.status(500).json({success, errors: [{msg: "Server Error"}]});
    }
}


exports.updateLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), success});
    }
    const { id, status } = req.body;
    try {
        const leave = await LeaveForm.findByIdAndUpdate(id, { status });
        success = true;
        return res.status(200).json({success, leave});
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({success, errors: [{msg: "Server Error"}]});
    }
}
