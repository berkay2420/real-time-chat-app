const saveMessage = require('../utils/saveMessage');
const getMessages = require('../utils/getMessages');
const leaveRoom = require('../utils/leaveRoom')


//io --> main server
//socket1, socket2, socket3... --> users

const CHAT_BOT = 'WelcomeBot';
let allUsers = [];

function connectSocket(io) {

  //listen to the client
  io.on('connection', (socket) => {

    

    socket.on("custom_event", (number, string) => {
      
    });

    //adding user to the room
    socket.on('join_room', (data) => {
      const { username, room } = data;
      socket.join(room);

      

      allUsers = allUsers.filter((user) => user.id !== socket.id);
      allUsers.push({ id: socket.id, room: room, username: username });

      let __createdtime__ = Date.now();

      let chatRoomUsers = allUsers.filter((user) => user.room === room);

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

      io.in(room).emit('chatroom_users', chatRoomUsers);

      ;

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

      allUsers = allUsers.filter((user) => user.id !== socket.id);

      //removing user from memory
      io.in(room).emit('chatroom_users', allUsers);
      io.in(room).emit('receive_message', {
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
        io.in(user.room).emit('chatroom_users', allUsers);
        io.in(user.room).emit('receive_message', {
          message: `${user.username} has disconnected from the chat.`,
          username: CHAT_BOT,
        });
      }
    });
  });
}

module.exports = connectSocket;