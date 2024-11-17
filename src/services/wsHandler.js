// Import models

// The socketHandler allows real-time communication for the access control system

export default (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
