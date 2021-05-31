import { Socket } from "socket.io";
import CodeMirrorclient from "../codemirror/codeMirrorClient";
import { MySocket, UserData, UserLang } from "./Rooms";

var rooms = new Map<string, CodeMirrorclient>();

function socketIo(io: Socket) {
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
    socket.on("join-room", (roomId, userId) => {
      console.log(roomId, userId);
      socket.join(roomId);
      socket.broadcast.in(roomId).emit("user-connected", userId);

      socket.on("disconnect", () => {
        socket.broadcast.in(roomId).emit("user-disconnected", userId);
      });
    });
    // socket.on("join-room", (userData) => {
    //   const { roomID, userID } = userData;
    //   socket.join(roomID);
    //   //@ts-ignore
    //   socket.in(roomID).emit("new-user-connect", userData);
    //   socket.on("disconnect", () => {
    //     //@ts-ignore
    //     socket.in(roomID).emit("user-disconnected", userID);
    //   });
    //   socket.on("display-media", (value) => {
    //     //@ts-ignore
    //     socket.in(roomID).emit("display-media", { userID, value });
    //   });
    //   socket.on("user-video-off", (value) => {
    //     //@ts-ignore
    //     socket.in(roomID).emit("user-video-off", value);
    //   });
    // });
    socket.on("new-message", (data) => {
      socket.broadcast.emit("add-message", data);
    });
    socket.on("draw_operation", (data) => {
      //socket
      socket.broadcast.emit("new_operation", data);
    });
    socket.on("disconnect", function () {
      socket.leave(socket.room);
    });
  });
}

export default socketIo;
