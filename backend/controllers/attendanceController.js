const { validationResult } = require('express-validator');
const { Student, Attendance } = require('../models');

const markWithID = async (req, res) => {
    console.log(req.body);
    const { id } = req.body;
    const date = new Date();
    const student = await Student.findOne({ student_id: id });
    const attendance = await Attendance.findOneAndUpdate({ student: student._id, date: { $gte: date.setHours(0, 0, 0, 0), $lt: date.setHours(23, 59, 59, 999) } }, { status: 'present' });
    res.status(200).json(attendance);
}

const markAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({success, errors: errors.array() });
    }
    const { student, status } = req.body;
    const date = new Date();
    try {
        await Attendance.findOneAndUpdate({ student, date: { $gte: date.setHours(0, 0, 0, 0), $lt: date.setHours(23, 59, 59, 999) } }, { status });
        success = true;
        res.status(200).json({ success });
    }
    catch (err) {
        res.status(500).json({ success, error: err.message });
    }
}

const getAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    const { student } = req.body;
    try {
        const attendance = await Attendance.find({ student });
        success = true;
        res.status(200).json({ success, attendance });
    }
    catch (err) {
        res.status(500).json({ success, error: err.message });
    }
}

const updateAttendance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { student, status } = req.body;
    try {
        const attendance = await Attendance.findOneAndUpdate({ student, date:date.now() }, { status });
        res.status(200).json(attendance);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getHostelAttendance = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success, errors: errors.array() });
    }
    // const { hostel } = req.body;
    try {
        const date = new Date();
        // const students = await Student.find({ hostel });
        const attendance = await Attendance.find({ date: { $gte: date.setHours(0, 0, 0, 0), $lt: date.setHours(23, 59, 59, 999) } }).populate('student', ['_id','name', 'room_no', 'student_id']);
        success = true;
        res.status(200).json({ success, attendance });
    }
    catch (err) {
        res.status(500).json({ success, error: err.message });
    }
}

module.exports = {
    markAttendance,
    getAttendance,
    updateAttendance,
    getHostelAttendance,
    markWithID
}

