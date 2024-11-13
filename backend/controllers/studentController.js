const { generateToken, verifyToken } = require('../utils/auth');
const { validationResult } = require('express-validator');
const { Student, Hostel, User, LeaveReq, Attendance } = require('../models');
const bcrypt = require('bcryptjs');
const Parser = require('json2csv').Parser;

const registerStudent = async (req, res) => {
    // console.log(req.body);
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors);
        return res.status(400).json({success, errors: errors.array() });
    }

    const { name, student_id, room_no, batch, dept, course, email, father_name, father_contact, contact, address, dob, hostel, password } = req.body;
    try {
        let student = await Student.findOne({ student_id });

        if (student) {
            return res.status(400).json({success, errors: [{ msg: 'Student already exists' }] });
        }
        let shostel = await Hostel.findOne({ name: hostel });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        let user = new User({
            email,
            password: hashedPassword,
            isAdmin: false,
            isParent: false
        });

        await user.save();
        
        student = new Student({
            name,
            student_id,
            room_no,
            batch,
            dept,
            course,
            email,
            father_name,
            father_contact,
            contact,
            address,
            dob,
            user: user.id,
            hostel: shostel.id
        });
        

        await student.save();
        await Request.findOneAndUpdate({student_id: student_id}, {status: 'approved'});
        const attendance = new Attendance({
            student: student.id,
            status: 'unmarked'
        });
        await attendance.save();

        success = true;
        res.json({success, student });
    } catch (err) {
        console.log(err)
        console.log(err)
        res.status(500).json({success, errors: 'Server error'});
    }
}

const getStudent = async (req, res) => {
    try {
        // console.log(req.body);
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log(errors);
            return res.status(400).json({success, errors: errors.array() });
        }

        const { isAdmin } = req.body;

        if (isAdmin) {
            return res.status(400).json({success, errors:  'Admin cannot access this route' });
        }

        const { token } = req.body;
        
        const decoded = verifyToken(token);

        const student = await Student.findOne({user: decoded.userId}).select('-password');
        
        if (!student) {
            return res.status(400).json({success, errors: 'Student does not exist' });
        }

        success = true;
        res.json({success, student });
    } catch (err) {
        res.status(500).json({success, errors: 'Server error'});
    }
}

const getAllStudents = async (req, res) => {

    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors);
        return res.status(400).json({success, errors: errors.array() });
    }

    let { hostel } = req.body;

    try {

        const shostel = await Hostel.findById(hostel);

        const students = await Student.find({ hostel: shostel.id }).select('-password');

        success = true;
        res.json({success, students});
    }
    catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const updateStudent = async (req, res) => {

    let success = false;
    try {
        const student = await Student.findById(req.student.id).select('-password');

        const { name, cms_id, room_no, batch, dept, course, email, father_name, contact, address, dob, cnic, user, hostel } = req.body;

        student.name = name;
        student.cms_id = cms_id;
        student.room_no = room_no;
        student.batch = batch;
        student.dept = dept;
        student.course = course;
        student.email = email;
        student.father_name = father_name;
        student.contact = contact;
        student.address = address;
        student.dob = dob;
        student.cnic = cnic;
        student.hostel = hostel;

        await student.save();

        success = true;
        res.json({success, student});
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const deleteStudent = async (req, res) => {
    try {
        // console.log(req.body);
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log(errors);
            return res.status(400).json({success, errors: errors.array() });
        }

        const { id } = req.body;

        const student = await Student.findById(id).select('-password');

        if (!student) {
            return res.status(400).json({success, errors: [{ msg: 'Student does not exist' }] });
        }

        const user = await User.findByIdAndDelete(student.user);

        await Student.deleteOne(student);

        success = true;
        res.json({success, msg: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const csvStudent = async (req, res) => {
    let success = false;
    try {
        // console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log(errors);
            return res.status(400).json({success, errors: errors.array() });
        }

        const { hostel } = req.body;

        const shostel = await Hostel.findById(hostel);

        const students = await Student.find({ hostel: shostel.id }).select('-password');

        students.forEach(student => {
            student.hostel_name = shostel.name;
            student.d_o_b = new Date(student.dob).toDateString().slice(4);
            student.cnic_no = student.cnic.slice(0, 5) + '-' + student.cnic.slice(5, 12) + '-' + student.cnic.slice(12);
            student.contact_no = "+92 "+student.contact.slice(1);
        });

        const fields = ['name', 'cms_id', 'room_no', 'batch', 'dept', 'course', 'email', 'father_name', 'contact_no', 'address', 'd_o_b', 'cnic_no', 'hostel_name'];

        const opts = { fields };

        const parser = new Parser(opts);

        const csv = parser.parse(students);

        success = true;
        res.json({success, csv});
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const createLeaveRequest = async (req, res) => {
    let success = false;
    try {
        const { student_id, name, batch, dept, course, reason, start_date, end_date } = req.body;
        const leaveRequest = new LeaveReq({student_id, name, batch, dept, course, reason, start_date, end_date});
        await leaveRequest.save();
        success = true;
        res.json({success, leaveRequest});
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const getLeaveRequests = async (req, res) => {
    let success = false;
    try {
        const leaveRequests = await LeaveReq.find({student_id: req?.body?.student_id});
        success = true;
        res.json({success, leaveRequests});
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

module.exports = {
    registerStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    getAllStudents,
    csvStudent
}