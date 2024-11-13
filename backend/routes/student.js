const express = require('express');
const { createRoomPref, getPrefferedRoommate, getRoomPref } = require('./../controllers/student');
const router = express.Router();

router.post("/createRoomPref", createRoomPref);
router.get("/getRoomPref/:studentId", getRoomPref);
router.get("/getPrefferedRoommate/:studentId", getPrefferedRoommate);

module.exports = router;