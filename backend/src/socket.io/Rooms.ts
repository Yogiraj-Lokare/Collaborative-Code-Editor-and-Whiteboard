import { Socket } from "socket.io";
import { language } from "../Collab/codemirror/codeMirrorClient";

export type UserData = {
  room: string;
  username: string;
};
export type UserLang = {
  room: string;
  language: language;
};
/**
 * extended Socket with room
 */
export class MySocket extends Socket {
  room!: string;
}

class Rooms extends Map {}
