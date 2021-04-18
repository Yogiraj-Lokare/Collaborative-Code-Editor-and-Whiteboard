const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { PeerServer } = require("peer");
const cors = require("cors");
const socketio = require("./socket.io/socketio");
app.use(cors());

const peerServer = PeerServer({ port: 3001, path: "/" });
socketio(io);

server.listen(1111);
