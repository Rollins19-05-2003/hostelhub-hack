const { validationResult } = require('express-validator');
const Request = require('../models/Request');
const socket = require('../utils/socket');

const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { student_id, name, batch, dept, course, email, contact, dob, father_name, father_contact, address, password} = req.body;
        const request = await Request.findOne({ student_id });
        if(request) {
            return res.status(400).json({ errors: [{ msg: 'Request already exists' }] });
        }

        const [y, m, d] = dob.split('-');
        const day = parseInt(d);
        const month = parseInt(m);
        const year = parseInt(y);
        const date = new Date(year, month, day);
        const newRequest = new Request({
            student_id, name, batch, dept, course, email, contact, dob: date, father_name, father_contact, address, password
        });
        await newRequest.save();
        // Emit the new request using the socket utility
        socket.emit('newRequest', {
            message: 'New registration request received',
            request: newRequest
        });
        
        res.json({ success: true, request: newRequest });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const getAll = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = {
    register,
    getAll
}