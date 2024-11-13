const express = require('express');
const connectDB = require('./utils/conn');
const cors = require('cors');
const socket = require('./utils/socket');
const studentRoutes = require('./routes/student');

const app = express();
const port = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/invoice', require('./routes/invoiceRoutes'));
app.use('/api/messoff', require('./routes/messoffRoutes'));
app.use('/api/leaveoff', require('./routes/leaveformRoutes'));
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/suggestion', require('./routes/suggestionRoutes'));
app.use('/api/parent', require('./routes/parentRoutes'));
app.use('/student', studentRoutes);


const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Initialize socket.io
const io = socket.init(server);

// io.on('connection', (socket) => {
//   socket.on('disconnect', () => {});
// });

const attendanceAutomation = require('./services/attendanceAutomation');
attendanceAutomation.start();