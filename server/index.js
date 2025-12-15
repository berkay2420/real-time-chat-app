const express = require("express");
http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

const {connectDB} = require('./database/database');
const connectSocket = require('./socket/index');

require('dotenv').config();

const app = express();
app.use(cors());

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

connectSocket(io);

server.listen(4000, ()=>{
  console.log(`The server started listening on port 5173`);
});


