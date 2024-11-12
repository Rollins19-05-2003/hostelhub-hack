const express = require('express');
const connectDB = require('./utils/conn');
const cors = require('cors');
const { Server } = require('socket.io');

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
app.use('/api/request', require('./routes/requestRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/suggestion', require('./routes/suggestionRoutes'));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
