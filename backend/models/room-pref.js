const mongoose = require("mongoose");

const roomPrefSchema = new mongoose.Schema({
    studentId: {
        type: Number,
        unique: true,
        required: true,
    },
    roomType: {
        type: String,
        enum: ["Single", "Double", "Triple"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    nonVeg: {
        type: Boolean,
        default: false,
    },
    state:{
        type: String,
        required:true
    },
    hobbies: {
        type: [String],
        enum: ["Reading", "Writing", "Sports", "Music", "Dance", "Art", "Crafts", "Cooking", "Gardening", "Painting", "Drawing", "Singing", "Dancing", "Acting", "Writing", "Reading", "Sports", "Music", "Dance", "Art", "Crafts", "Cooking", "Gardening", "Painting", "Drawing", "Singing", "Dancing", "Acting"],
        default: [],
    },
    branch: {
        type: String,
        enum: ["CSE", "IT", "ECE", "EEE", "ME", "CE", "CSBS", "CSIT", "CSIT(DS)", "CSIT(AI)", "CSIT(ML)", "CSIT(AI&ML)", "CSIT(AI&DS)", "CSIT(DS&ML)"],
        default: "",
    },
});

module.exports = mongoose.model("RoomPref", roomPrefSchema);