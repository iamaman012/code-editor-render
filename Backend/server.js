const cors = require("cors");
const express = require("express");
const ACTIONS = require("../frontend/src/Actions.js")
const app = express();

const http = require("http"); // it is inbuilt in node

const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust to your frontend URL
    methods: ["GET", "POST"],
  },
}); // crate an instance of server class of socket.io
app.use(cors);
const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    console.log(code);
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  // socket.on("languageChange", ({ roomId, sl }) => {
  //   console.log("hi");
  //   socket.in(roomId).emit("languageChange", { sl });
  // });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISSCONNECT, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
  socket.on("leaving", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISSCONNECT, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});
server.get("/",(req,res)=>{
  res.send("hello")
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening in port ${PORT}`);
});
