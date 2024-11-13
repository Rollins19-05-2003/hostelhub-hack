const express = require('express');
const router = express.Router();
const { submitMaintenanceRequest, getMaintenanceRequests } = require('../controllers/maintenanaceController');

router.post('/create', submitMaintenanceRequest);
router.get('/get', getMaintenanceRequests);

module.exports = router;