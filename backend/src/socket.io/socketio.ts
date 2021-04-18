import { Socket } from "socket.io";
import CodeMirrorclient from "../codemirror/codeMirrorClient";
import { MySocket, UserData, UserLang } from "./Rooms";

var rooms = new Map<string, CodeMirrorclient>();

module.exports = function code(io: Socket) {
  io.on("connection", (socket: MySocket) => {
    console.log("connection");
    socket.on("joinRoom", function (data: UserData) {
      if (!rooms.has(data.room)) {
        var codeclient = new CodeMirrorclient(data.room);
        rooms.set(data.room, codeclient);
      }
      let codeClient = rooms.get(data.room);
      codeClient?.addUser(socket, data.username);
      rooms.set(data.room, codeClient!);
      socket.room = data.room;
      socket.join(data.room);
    });
    socket.on("changeLanguage", (data: UserLang) => {
      if (rooms.has(data.room)) {
        let codeClient = rooms.get(data.room);
        codeClient?.changeLang(data.language);
        codeClient?.EmitDoc(io);
        rooms.set(data.room, codeClient!);
      }
    });
    socket.on("join-room", (_roomId, userId) => {
      //socket.join(roomId);
      console.log("peertry");
      socket.broadcast.emit("user-connected", userId);

      // socket.on("disconnect", () => {
      //   //socket.to(roomId).broadcast.emit("user-disconnected", userId);
      // });
    });
    socket.on("canvas-data", (data) => {
      socket.broadcast.emit("canvas-data", data);
    });
    socket.on("draw_operation", (data) => {
      socket.broadcast.emit("new_operation", data);
    });
    socket.on("disconnect", function () {
      socket.leave(socket.room);
    });
  });
};
