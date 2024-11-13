const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { requestLeave, countLeave, listLeave, updateLeave } = require('../controllers/leaveformController');


router.post('/request', [
    check('student', 'Student ID is required').not().isEmpty(),
    check('leaving_date', 'Leaving date is required').not().isEmpty(),
    check('return_date', 'Return date is required').not().isEmpty()
], requestLeave);


router.post('/count', [
    check('student', 'Student ID is required').not().isEmpty()
], countLeave);


router.post('/list', [
    check('hostel', 'Hostel is required').not().isEmpty()
], listLeave);


router.post('/update', [
    check('id', 'ID is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty()
], updateLeave);

module.exports = router;
