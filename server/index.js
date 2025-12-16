const express = require("express");
http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const cookieParser = require("cookie-parser");

const {connectDB} = require('./database/database');
const connectSocket = require('./socket/index');

const authRoute = require('./routes/authRoute');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
})

connectSocket(io);

server.listen(4000, ()=>{
  console.log(`The server started listening on port 5173`);
});


app.use("/auth", authRoute);