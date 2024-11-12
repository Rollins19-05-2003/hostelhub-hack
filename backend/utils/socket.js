let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });
        return io;
    },
    emit: (event, data) => {
        if (io) {
            io.emit(event, data);
        }
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
