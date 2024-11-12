const express = require('express');
const { createRoomPref, getPrefferedRoommate } = require('./../controllers/student');
const router = express.Router();

router.post("/createRoomPref", createRoomPref);
router.get("/getPrefferedRoommate/:studentId", getPrefferedRoommate);

module.exports = router;