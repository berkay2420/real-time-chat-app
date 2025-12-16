const saveMessage = require('../utils/saveMessage');
const getMessages = require('../utils/getMessages');
const leaveRoom = require('../utils/leaveRoom')


//io --> main server
//socket1, socket2, socket3... --> users

const CHAT_BOT = 'SocketBot';
let chatRoom = '';
let allUsers = [];

function connectSocket(io) {

  //listen to the client
  io.on('connection', (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on("custom_event", (number, string) => {
      console.log(number, string);
    });

    //adding user to the room
    socket.on('join_room', (data) => {
      const { username, room } = data;
      socket.join(room);

      console.log(`User ${username} joined room ${room}`);

      allUsers = allUsers.filter((user) => user.username !== username);
      allUsers.push({ id: socket.id, room: room, username: username });


      let __createdtime__ = Date.now();

      let chatRoomUsers = allUsers.filter((user) => user.room === room);
      
      chatRoom = room;


      //Send a message to the all users in that room except new user
      socket.to(room).emit('receive_message', {
        message: `${username} has joined the room`,
        username: CHAT_BOT,
        __createdtime__
      });
     
      //Send a welcome message to the new user
      socket.emit('receive_message', {
        message: `Welcome ${username}`,
        username: CHAT_BOT,
        __createdtime__
      });


      //emit to the current user
      //to().emit() broadcasting to the room excluding current user

      chatRoom = room;

      allUsers.push({ id: socket.id, room: room, username: username });

      chatRoomUsers = allUsers.filter((user) => user.room === room);

      socket.to(room).emit('chatroom_users', chatRoomUsers);
      socket.emit('chatroom_users', chatRoomUsers);

      console.log(`all users ${allUsers}`);
      console.log(`users in this room ${chatRoomUsers}`);

      //get last 100 message in room
      getMessages(room)
        .then((lastMessages) => {
          socket.emit('last_messages', lastMessages);
        })
        .catch((err) =>
          console.log(`Failed to fetch messages error: ${err}`)
        );
    });

    //send message
    socket.on('send_message', (data) => {
      const { message, username, room, __createdtime__ } = data;

      io.in(room).emit('receive_message', data); //send message to the all users including current user

      //save to the database
      saveMessage(message, username, room, __createdtime__)
        .then((response) => console.log(response))
        .catch((err) =>
          console.log(`Error while saving the message error: ${err}`)
        );
    });

    //leave room
    socket.on("leave_room", (data) => {
      const { username, room } = data;
      socket.leave(room);

      const __createdtime__ = Date.now();

      //removing user from memory
      socket.to(room).emit('chatroom_users', allUsers);
      socket.to(room).emit('receive_message', {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
      });

      console.log(`${username} has left the chat`);
    });

    socket.on('disconnect', () => {
      const user = allUsers.find((user) => user.id == socket.id);
      if (user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit('chatroom_users', allUsers);
        socket.to(chatRoom).emit('receive_message', {
          message: `${user.username} has disconnected from the chat.`,
        });
      }
    });
  });
}

module.exports = connectSocket;
