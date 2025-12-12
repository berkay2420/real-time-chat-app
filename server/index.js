const express = require("express");
http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

const {connectDB} = require('./database/database');
const saveMessage = require('./services/saveMessage');
const getMessages = require('./services/getMessages');

require('dotenv').config();

const app = express();

app.use(cors());

connectDB();

const server = http.createServer(app);

//io --> main server
//socket1, socket2, socket3... --> users

const CHAT_BOT = 'SocketBot';
let chatRoom = '';
let allUsers = []; 


const io = new Server(server, {
    cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

//listen to the client
io.on('connection', (socket) => {

  console.log(`User connected: ${socket.id}`);

  socket.on("custom_event",(number, string) =>{
    console.log(number,string);
  })

  //adding user to the room
  socket.on('join_room', (data) => {
    const {username, room} = data;
    socket.join(room);

    console.log(`User ${username} joined room ${room}`)

    let __createdtime__ = Date.now();
    
    //Send a message to the all users in that room except new user
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the room`,
      username: CHAT_BOT,
      __createdtime__
    });

    console.log(`SERVER: 'receive_message' to room ${room} (excluding self) sent.`);

    //Send a welcome message to the new user
    socket.emit('receive_message', {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__
    });

    console.log(`SERVER: 'receive_message' to self sent. (Welcome message)`);

    //emit to the current user
    //to().emit() broadcasting to the room excluding current user

    chatRoom = room;

    allUsers.push({id: socket.id, room: room});

    chatRoomUsers = allUsers.filter((user) => user.room === room);

    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers)
    
    console.log(`all users ${allUsers}`);
    console.log(`users in this room ${chatRoomUsers}`);

    //get last 100 message in room
    getMessages(room)
      .then((lastMessages) => {
      socket.emit('last_messages', lastMessages);
      })
      .catch((err) => console.log(`Failed to fetch messages error: ${err}`));
  });

  //send message
  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;

    io.in(room).emit('receive_message', data) //send message to the all users including current user

    //save to the database
    saveMessage(message, username, room, __createdtime__)
      .then((response) => console.log(response))
      .catch((err) => console.log(`Error while saving the message error: ${err}`));

  })
})



server.listen(4000, ()=>{
  console.log(`The server started listening on port 5173`);
});


