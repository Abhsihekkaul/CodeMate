// ✅ FIXED BACKEND SOCKET HANDLER
const socket = require('socket.io');

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socket.on("joinChat", ({ firstName, UserID, targetUserId }) => {
      const room = [UserID, targetUserId].sort().join('_');
      console.log(`${firstName} joined the room ${room}`);
      socket.join(room);
    });

    socket.on("sendMessage", ({ firstName, UserID, targetUserId, text }) => {
      const roomId = [UserID, targetUserId].sort().join('_');
      console.log(`${firstName} sent: ${text}`);
      io.to(roomId).emit("receiveMessage", {
        senderId: UserID,
        firstName,
        text,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initilizeSocket;
