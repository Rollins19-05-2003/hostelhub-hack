const express = require('express');
const router = express.Router();
const { createDonation, getDonations } = require('../controllers/donationController');

// Create donation
router.post('/create', createDonation);

// Get all donations
router.get('/get', getDonations);

module.exports = router;
