import { Mouse } from "../types";
import { socket } from "./socket";

export const SendCursorPosition = (mouse: Mouse) => {
  socket.emit("cursor-pos", mouse);
};

socket.on("server-cursor", (mouse: Mouse) => {
  applyCursorPostion(mouse);
});

export const applyCursorPostion = (mouse: Mouse) => {};
