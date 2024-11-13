const RoomPref = require('./../models/room-pref');
const Student = require('./../models/Student');

const createRoomPref = async (req, res) => {
    const { studentId, roomType, nonVeg, hobbies, state, branch } = req.body;
    try {
        // Check if preference already exists
        let existingPref = await RoomPref.findOne({ studentId });
        
        if (existingPref) {
            // Update existing preference
            const updatedPref = await RoomPref.findOneAndUpdate(
                { studentId },
                { roomType, nonVeg, hobbies, state, branch },
                { new: true } // Return updated document
            );
            return res.status(200).json({
                message: "Room preference updated successfully",
                roomPref: updatedPref
            });
        }

        // Create new preference if doesn't exist
        const roomPref = await RoomPref.create({ 
            studentId, 
            roomType, 
            nonVeg, 
            hobbies, 
            state, 
            branch 
        });
        
        res.status(201).json({
            message: "Room preference created successfully",
            roomPref
        });
    } catch (error) {
        console.error('Room preference error:', error);
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
            studentId: { $ne: studentId },
            // state: studentPref.state,
        });

        const studentDetails = await Student.find({
            student_id: { 
                $in: potentialRoommates.map(rm => rm.studentId) 
            }
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

            const studentDetail = studentDetails.find(
                s => s.student_id === roommate.studentId
            );

            return {
                studentId: roommate?.studentId,
                score,
                preferences: roommate,
                studentDetails: studentDetail || null
            };
        });
        
        const recommendations = scoredRoommates
            .filter(r => r.studentDetails !== null)
            .sort((a, b) => b?.score - a?.score)
            .slice(0, 5);

        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getRoomPref = async (req, res) => {
    const { studentId } = req.params;
    try {
        const roomPref = await RoomPref.findOne({ studentId });
        if (!roomPref) {
            return res.status(404).json({ message: "Room preference not found" });
        }
        res.status(200).json(roomPref);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports =  { createRoomPref, getPrefferedRoommate, getRoomPref };