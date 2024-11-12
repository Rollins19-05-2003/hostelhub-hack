const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    console.log(mongoURI);
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.error('MongoDB connection FAIL', error);
        process.exit(1);
    }
    };

module.exports = connectDB;