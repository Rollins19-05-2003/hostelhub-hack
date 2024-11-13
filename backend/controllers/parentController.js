const { validationResult } = require('express-validator');
const { Parent, Student, User, ParentRequest } = require('../models');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const getParent = async (req, res) => {
    let success = false;
    try {
        const { token } = req.body;
        
        // Verify token and get decoded data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find parent by user ID (since parent is linked to user)
        const parent = await Parent.findOne({ user: decoded.userId });

        if (!parent) {
            return res.status(404).json({ 
                success: false, 
                errors: [{ msg: 'Parent not found' }] 
            });
        }

        // If parent found, return success
        success = true;
        res.json({ success, parent });

    } catch (err) {
        console.error('Error in getParent:', err);
        res.status(500).json({ 
            success: false, 
            errors: [{ msg: 'Server error', error: err.message }] 
        });
    }
};

const registerParentRequest = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { name, email, contact, address, children_ids, password } = req.body;

    try {
        // Check if parent already exists
        let parent = await Parent.findOne({ email });
        if (parent) {
            return res.status(400).json({ success, errors: [{ msg: 'Parent already exists' }] });
        }

        // Create parent request
        const parentRequest = new ParentRequest({
            name,
            email,
            contact,
            address,
            children_ids,
            password
        });

        await parentRequest.save();
        success = true;
        res.json({ success, parentRequest });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success, errors: [{ msg: 'Server error' }] });
    }
};

const approveParentRequest = async (req, res) => {
    let success = false;
    try {
        const { name, email, contact, address, children_ids, password } = req.body;

        // Verify all children exist
        const students = await Student.find({ student_id: { $in: children_ids } });
        if (students.length !== children_ids.length) {
            return res.status(400).json({ success, errors: [{ msg: 'One or more students not found' }] });
        }

        // Create user account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hashedPassword,
            isAdmin: false,
            isParent: true
        });

        await user.save();

        // Create parent
        const parent = new Parent({
            name,
            email,
            contact,
            address,
            children: students.map(student => student._id),
            user: user._id
        });

        await parent.save();

        // Update request status
        await ParentRequest.findOneAndUpdate({email}, {status: 'approved'});
        success = true;
        res.json({ success, parent });
    } catch (err) {
        res.status(500).json({ success, errors: [{ msg: 'Server error' }] });
    }
};

const getParentChildren = async (req, res) => {
    let success = false;
    try {
        const { parentId } = req.body;
        const parent = await Parent.findById(parentId).populate({
            path: 'children',
            select: 'name student_id room_no'
        });

        if (!parent) {
            return res.status(400).json({ success, errors: [{ msg: 'Parent not found' }] });
        }

        success = true;
        res.json({ success, children: parent.children });
    } catch (err) {
        res.status(500).json({ success, errors: [{ msg: 'Server error' }] });
    }
};

module.exports = {
    registerParentRequest,
    approveParentRequest,
    getParentChildren,
    getParent
}; 