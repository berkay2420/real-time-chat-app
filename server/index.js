const express = require("express");
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const cookieParser = require("cookie-parser");

const {connectDB} = require('./database/database');
const connectSocket = require('./socket/index');

const authRoute = require('./routes/authRoute');
const roomRoute = require('./routes/roomRoute');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

require('dotenv').config();

const app = express();

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
})

connectSocket(io);

const PORT = process.env.PORT || 4000;

server.listen(PORT, ()=>{
  console.log(`The server started listening on port ${PORT}`);
});


app.use("/auth", authRoute);
app.use("/rooms", roomRoute);