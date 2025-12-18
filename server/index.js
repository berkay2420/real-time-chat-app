require('dotenv').config();

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

const app = express();


app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


connectDB();

app.use("/auth", authRoute);
app.use("/rooms", roomRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
})

connectSocket(io);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(401).json({ message: err.message || "Unauthorized" });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`The server started listening on port ${PORT}`);
});

