import { Socket } from "socket.io";
import { language } from "../codemirror/codeMirrorClient";

export type UserData = {
  room: string;
  username: string;
};
export type UserLang = {
  room: string;
  language: language;
};
export class MySocket extends Socket {
  room!: string;
}

class Rooms extends Map {}
