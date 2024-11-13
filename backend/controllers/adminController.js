const {generateToken, verifyToken} = require('../utils/auth');
const {validationResult} = require('express-validator');
const {Admin, User, Hostel, Request, ParentRequest, Student} = require('../models');
const bcrypt = require('bcryptjs');


// const registerAdmin = async (req, res) => {
//     try {
//         let success = false;
//         console.log(req.body);
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({success, errors: errors.array()});
//         }

//         const {name, email, father_name, contact, address, dob, cnic, hostel, password} = req.body;

//         try {
//             let admin = await Admin.findOne({email});

//             if (admin) {
//                 return res.status(400).json({success, errors: [{msg: 'Admin already exists'}]});
//             }

//             let shostel = await Hostel.findOne({name: hostel});

//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);

//             let user = new User({
//                 email,
//                 password: hashedPassword,
//                 isAdmin: true
//             });

//             await user.save();

//             admin = new Admin({
//                 name,
//                 email,
//                 father_name,
//                 contact,
//                 address,
//                 dob,
//                 cnic,
//                 user: user.id,
//                 hostel: shostel.id
//             });

//             await admin.save();

//             const token = generateToken(user.id, user.isAdmin);

//             success = true;
//             res.json({success, token, admin});

//         } catch (error) {
//             res.status(500).send('Server error');
//         }
//     } catch (err) {
//         res.status(500).json({success, errors: [{msg: 'Server error'}]});
//     }
// }

const registerAdmin = async (req, res) => {
    try {
        let success = false;
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {name, email, father_name, contact, address, dob, hostel, password} = req.body;

        try {
            let admin = await Admin.findOne({email});

            if (admin) {
                return res.status(400).json({success, errors: [{msg: 'Admin already exists'}]});
            }

            let shostel = await Hostel.findOne({_id : hostel});

            if (!shostel) {
                return res.status(400).json({success, errors: [{msg: 'Hostel not found'}]});
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            let user = new User({
                email,
                password: hashedPassword,
                isAdmin: true
            });

            await user.save();

            admin = new Admin({
                name,
                email,
                father_name,
                contact,
                address,
                dob,
                user: user.id,
                hostel: shostel._id
            });

            await admin.save();

            const token = generateToken(user.id, user.isAdmin);

            success = true;
            res.json({success, token, admin});

        } catch (error) {
            console.error('Error saving admin:', error); // Log error details
            res.status(500).send('Server error');
        }
    } catch (err) {
        console.error('Error in main try-catch:', err); // Log error details
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

const registerHostel = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, rooms, capacity, vacant } = req.body;

    try {
        // Check if a hostel with the same name and location already exists
        let hostel = await Hostel.findOne({ name, location });
        if (hostel) {
            return res.status(400).json({ msg: 'Hostel already exists' });
        }

        // Create a new hostel instance
        hostel = new Hostel({
            name,
            location,
            rooms,
            capacity,
            vacant
        });

        // Save the hostel to the database
        await hostel.save();

        res.status(201).json({ msg: 'Hostel registered successfully', hostel });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}


const updateAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {name, email, father_name, contact, address, dob, cnic} = req.body;

        try {
            let admin = await Admin.findOne({email});

            if (!admin) {
                return res.status(400).json({success, errors: [{msg: 'Admin does not exists'}]});
            }

            admin.name = name;
            admin.email = email;
            admin.father_name = father_name;
            admin.contact = contact;
            admin.address = address;
            admin.dob = dob;
            admin.cnic = cnic;

            await admin.save();

            success = true;
            res.json({success, admin});

        } catch (error) {
            res.status(500).send('Server error');
        }
    } catch (err) {
        res.status(500).json({success, errors: [{msg: 'Server error'}]});
    }
}

// const updateStudent = async (req, res) => {
//     try {
//         let success = false;
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({success, errors: errors.array()});
//         }

//         const { name, student_id, room_no, batch, dept, course, email, father_name, father_contact, contact, address, dob, hostel, password} = req.body;

//         try {
//             let student = await Student.findOne({email});

//             if (!student) {
//                 return res.status(400).json({success, errors: [{msg: 'Student does not exists'}]});
//             }

//             student.name = name;
//             student.email = email;
//             student.father_name = father_name;
//             student.contact = contact;
//             student.address = address;
//             student.dob = dob;
//             student.cnic = cnic;

//             await student.save();

//             success = true;
//             res.json({success, student});

//         } catch (error) {
//             res.status(500).send('Server error');
//         }
//     } catch (err) {
//         res.status(500).json({success, errors: [{msg: 'Server error'}]});
//     }
// }

const getHostel = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {id} = req.body

        let admin = await Admin.findById(id);
        
        if (!admin) {
            return res.status(400).json({success, errors: [{msg: 'Admin does not exists'}]});
        }

        let hostel = await Hostel.findById(admin.hostel);
        success = true;
        res.json({success, hostel});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const getAdmin = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }
    try {
        const {isAdmin} = req.body;
        if (!isAdmin) {
            return res.status(401).json({success, errors: [{msg: 'Not an Admin, authorization denied'}]});
        }
        const {token} = req.body;
        if (!token) {
            return res.status(401).json({success, errors: [{msg: 'No token, authorization denied'}]});
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({success, errors: [{msg: 'Token is not valid'}]});
        }
        
        let admin = await Admin.findOne({user:decoded.userId}).select('-password');
        
        if (!admin) {
            return res.status(401).json({success, errors: [{msg: 'Token is not valid'}]});
        }

        success = true;
        res.json({success, admin});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const deleteAdmin = async (req, res) => {
    try {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array()});
        }

        const {email} = req.body

        let admin = await Admin.findOne({email});

        if (!admin) {
            return res.status(400).json({success, errors: [{msg: 'Admin does not exists'}]});
        }

        const user = await User.findById(admin.user);

        await User.deleteOne(user);

        await Admin.deleteOne(admin);

        success = true;
        res.json({success, msg: 'Admin deleted'});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const getNotifications = async (req, res) => {
    try {
        const studentRequests = await Request.find({status: 'pending'});
        const parentRequests = await ParentRequest.find({status: 'pending'});
        let notifications = {student : studentRequests, parent : parentRequests};
        res.json({success: true, notifications: notifications});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const approveRequest = async (req, res) => {
    try {
        let request = await Request.findByIdAndUpdate(req.params.id, {status: 'approved'});
        res.json({success: true, request: request});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const rejectRequest = async (req, res) => {
    try {
        let request = await Request.findByIdAndUpdate(req.params.id, {status: 'rejected'});
        res.json({success: true, request: request});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveReq.find({});
        res.json({success: true, leaveRequests});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const approveLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveReq.findByIdAndUpdate(req.params.id, {status: 'approved'});
        res.json({success: true, leaveRequest});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

const rejectLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveReq.findByIdAndUpdate(req.params.id, {status: 'rejected'});
        res.json({success: true, leaveRequest});
    } catch (error) {
        res.status(500).send('Server error');
    }
}

module.exports = {
    registerAdmin,
    registerHostel,
    updateAdmin,
    // updateStudent,
    getAdmin,
    getHostel,
    deleteAdmin,
    getNotifications,
    approveRequest,
    rejectRequest,
    getLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest
}