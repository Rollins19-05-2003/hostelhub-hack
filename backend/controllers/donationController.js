const Donation = require('../models/Donation');
const { validationResult } = require('express-validator');

exports.createDonation = async (req, res) => {
    let success = false;
    try {
        const { student, hostel, itemName, category, description, condition } = req.body;

        // Validate category
        const validCategories = ['Books', 'Uniforms', 'Electronics', 'Furniture', 'Others'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid category' 
            });
        }

        // Validate condition
        const validConditions = ['New', 'Like New', 'Good', 'Fair'];
        if (!validConditions.includes(condition)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid condition' 
            });
        }

        const donation = new Donation({
            student,
            hostel,
            itemName,
            category,
            description,
            condition
        });

        await donation.save();
        success = true;
        res.json({ success, message: 'Item listed for donation successfully' });
    } catch (error) {
        console.error('Error in createDonation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
}

exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'available' })
            .sort({ date: -1 })
            .populate('student', ['name', 'room_no'])
            .populate('hostel', ['name']);

        res.json({ success: true, donations });
    } catch (error) {
        console.error('Error in getDonations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
} 