const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerParentRequest, approveParentRequest, getParentChildren } = require('../controllers/parentController');

router.post('/register-request', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('contact', 'Contact is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('children_ids', 'Children IDs are required').isArray().not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
], registerParentRequest);

router.post('/approve-request', [
    check('requestId', 'Request ID is required').not().isEmpty()
], approveParentRequest);

router.post('/get-children', [
    check('parentId', 'Parent ID is required').not().isEmpty()
], getParentChildren);

module.exports = router; 