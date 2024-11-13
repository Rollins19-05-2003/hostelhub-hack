const RoomPref = require('./../models/room-pref');

const createRoomPref = async (req, res) => {

    const { studentId, roomType, nonVeg, hobbies, state, branch } = req.body;
    console.log(req.body)
    try {
        const roomPref = await RoomPref.create({ studentId, roomType, nonVeg, hobbies, state, branch });
        res.status(201).json(roomPref);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getPrefferedRoommate = async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const studentPref = await RoomPref.findOne({ studentId });
        if (!studentPref) {
            return res.status(404).json({ message: "Student preferences not found" });
        }

        const potentialRoommates = await RoomPref.find({ 
            // nonVeg, hobbies, state, branch
            studentId: { $ne: studentId },
            state: studentPref.state,
            // roomType: studentPref.roomType,
            // nonVeg: studentPref.nonVeg,
            // hobbies: studentPref.hobbies,
            // branch: studentPref.branch
        });

        const scoredRoommates = potentialRoommates.map(roommate => {
            let score = 0;
            if (roommate?.nonVeg === studentPref?.nonVeg) score += 2;
            if (roommate?.state === studentPref?.state) score += 1;
            if (roommate?.branch === studentPref?.branch) score += 1;
            const commonHobbies = studentPref?.hobbies?.filter(hobby => 
                roommate?.hobbies?.includes(hobby)
            );
            score += commonHobbies.length;

            return {
                studentId: roommate?.studentId,
                score,
                preferences: roommate
            };
        });
        
        const recommendations = scoredRoommates
            .sort((a, b) => b?.score - a?.score)
            .slice(0, 5); // Return top 5 matches

        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports =  { createRoomPref, getPrefferedRoommate };