// Import models

// The socketHandler allows real-time communication for the access control system
let ioInstance;

const socketHandler = (io) => {
  ioInstance = io;
  io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export { socketHandler, ioInstance };
