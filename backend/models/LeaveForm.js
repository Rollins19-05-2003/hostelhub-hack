const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveReqSchema = new mongoose.Schema({
    // student_id: {
    //     type: String,
    //     required: true
    // },
    // name: {
    //     type: String,
    //     required: true
    // },
    // batch: {
    //     type: String,
    //     required: true
    // },
    // dept: {
    //     type: String,
    //     required: true
    // },
    // course: {
    //     type: String,
    //     required: true
    // },
    // reason: {
    //     type: String,
    //     required: true
    // },
    student:{
        type:Schema.Types.ObjectId,
        ref:'student'
    },
    leaving_date:{
        type:Date,
        required:true
    },
    return_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    },
    request_date:{
        type:Date,
        default:Date.now
    }
})
module.exports = LeaveForm = mongoose.model('LeaveReq', LeaveReqSchema);