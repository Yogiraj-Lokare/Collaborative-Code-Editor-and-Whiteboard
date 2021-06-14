import { Socket } from "socket.io";
import Collab from "../Collab";
import CodeMirrorclient from "../Collab/codemirror/codeMirrorClient";
import WhiteBoard from "../Collab/whiteBoard/whiteBoard";
import { MySocket, UserData, UserLang } from "./Rooms";

var rooms = new Map<string, Collab>();

function socketIo(io: Socket) {
  io.on("connection", (socket: MySocket) => {
    console.log("connection");

    socket.on("joinRoom", function (data: UserData) {
      if (!rooms.has(data.room)) {
        let CollabClient = new Collab(data.room);
        rooms.set(data.room, CollabClient);
      }
      let CollabClient = rooms.get(data.room);
      CollabClient?.CodeMirrorClient.addUser(socket, data.username);
      //socket.emit("init-board", CollabClient?.WhiteBoard.GetAllOperations());
      //CollabClient?.WhiteBoard.SendAllOperations(socket);

      rooms.set(data.room, CollabClient!);
      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on("init-board", (data) => {
      if (rooms.has(data.room)) {
        let CollabClient = rooms.get(data.room);
        socket.emit("get-all-ops", CollabClient?.WhiteBoard.GetAllOperations());

        rooms.set(data.room, CollabClient!);
      }
    });
    socket.on("reset-board", (data) => {
      if (rooms.has(data.room)) {
        let CollabClient = rooms.get(data.room);
        CollabClient?.WhiteBoard.ClearOperations();
        socket.in(data.room).emit("clear-board");
        rooms.set(data.room, CollabClient!);
      }
    });
    // socket.on("joinRoom", function (data: UserData) {
    //   if (!rooms.has(data.room)) {
    //     var codeclient = new CodeMirrorclient(data.room);
    //     rooms.set(data.room, codeclient);
    //   }
    //   let codeClient = rooms.get(data.room);
    //   codeClient?.addUser(socket, data.username);
    //   rooms.set(data.room, codeClient!);
    //   socket.room = data.room;
    //   socket.join(data.room);
    // });
    socket.on("changeLanguage", (data: UserLang) => {
      if (rooms.has(data.room)) {
        let CollabClient = rooms.get(data.room);
        CollabClient?.CodeMirrorClient.changeLanguage(data.language);
        CollabClient?.CodeMirrorClient.emitDoc(io);
        rooms.set(data.room, CollabClient!);
      }
    });
    // socket.on("changeLanguage", (data: UserLang) => {
    //   if (rooms.has(data.room)) {
    //     let codeClient = rooms.get(data.room);
    //     codeClient?.changeLanguage(data.language);
    //     codeClient?.EmitDoc(io);
    //     rooms.set(data.room, codeClient!);
    //   }
    // });
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

    //WhiteBoard

    socket.on("new_operation", (data) => {
      if (rooms.has(data.room)) {
        let CollabClient = rooms.get(data.room);
        CollabClient?.WhiteBoard.AddNewOperation(data.operation);
        socket.in(data.room).emit("new-op", data.operation);
        rooms.set(data.room, CollabClient!);
      }
    });

    // socket.on("join-meet-room", (roomID, username) => {
    //   let Board = new WhiteBoard();
    //   socket.broadcast
    //     .in(roomID)
    //     .emit("init-whiteboard", Board.GetAllOperations());
    // });

    // socket.on("draw_operation", (data) => {
    //   //socket
    //   socket.broadcast.emit("new_operation", data);
    // });
    socket.on("disconnect", function () {
      socket.leave(socket.room);
    });
  });
}

export default socketIo;
