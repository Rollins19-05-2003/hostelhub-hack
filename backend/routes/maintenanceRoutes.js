const express = require('express');
const router = express.Router();
const { submitMaintenanceRequest, getMaintenanceRequests, updateMaintenanceStatus, getStudentMaintenanceRequests } = require('../controllers/maintenanaceController');

router.post('/create', submitMaintenanceRequest);
router.get('/get', getMaintenanceRequests);
router.get('/get/:id', getStudentMaintenanceRequests);
router.post('/update', updateMaintenanceStatus);

module.exports = router;