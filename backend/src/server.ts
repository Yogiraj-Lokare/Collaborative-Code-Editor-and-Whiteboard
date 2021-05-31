import express from "express";
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
import { PeerServer } from "peer";
import cors from "cors";
import socketIo from "./socket.io/socketio";
import mongoose from "mongoose";
import { DATABASE_URL } from "./Constants";
import UserRoute from "./Routes/User";
import InterviewsRoute from "./Routes/Interviews";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

socketIo(io);

app.use("/user", UserRoute);
app.use("/interview", InterviewsRoute);

//node peerjs --port 3001
const peerServer = PeerServer({ port: 3001, path: "/" });

server.listen(1111);
