const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'student'
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    contact:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Parent = mongoose.model('parent', ParentSchema);