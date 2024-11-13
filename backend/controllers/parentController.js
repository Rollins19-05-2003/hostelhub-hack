const { validationResult } = require('express-validator');
const { Parent, Student, User, ParentRequest } = require('../models');
const bcrypt = require('bcryptjs');

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
        res.status(500).json({ success, errors: [{ msg: 'Server error' }] });
    }
};

const approveParentRequest = async (req, res) => {
    let success = false;
    try {
        const { requestId } = req.body;
        const parentRequest = await ParentRequest.findById(requestId);
        
        if (!parentRequest) {
            return res.status(400).json({ success, errors: [{ msg: 'Request not found' }] });
        }

        // Verify all children exist
        const students = await Student.find({ student_id: { $in: parentRequest.children_ids } });
        if (students.length !== parentRequest.children_ids.length) {
            return res.status(400).json({ success, errors: [{ msg: 'One or more students not found' }] });
        }

        // Create user account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parentRequest.password, salt);

        const user = new User({
            email: parentRequest.email,
            password: hashedPassword,
            isAdmin: false,
            isParent: true
        });

        await user.save();

        // Create parent
        const parent = new Parent({
            name: parentRequest.name,
            email: parentRequest.email,
            contact: parentRequest.contact,
            address: parentRequest.address,
            children: students.map(student => student._id),
            user: user._id
        });

        await parent.save();

        // Update request status
        parentRequest.status = 'approved';
        await parentRequest.save();

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
    getParentChildren
}; 