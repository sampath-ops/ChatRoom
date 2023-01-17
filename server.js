const app = require("./app");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const http = require("http");

// ADD TO ENVIRONMENT VARIABLES
dotenv.config({ path: './.env' });

const port = process.env.PORT || 8000;

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

//CONNECT TO CLOUD DATABASE
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected successfully!!!'));

/** Create HTTP server. */
const server = http.createServer(app);

/** Create socket connection */
// global.io = require("socket.io")(server);
// global.io.on('connection', WebSockets.connection)

const io = require("socket.io")(server,{
  cors: {
    
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  const user = users.find((user) => user.userId == userId);
  return user;
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(user)
    if(user){
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`server is running on port: ${port}`);
});