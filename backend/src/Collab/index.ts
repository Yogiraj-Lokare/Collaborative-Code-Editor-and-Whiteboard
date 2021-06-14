import CodeMirrorclient from "./codemirror/codeMirrorClient";
import WhiteBoard from "./whiteBoard/whiteBoard";

class Collab {
  roomID: string;
  CodeMirrorClient: CodeMirrorclient;
  WhiteBoard: WhiteBoard;
  constructor(roomID: string) {
    this.roomID = roomID;
    this.CodeMirrorClient = new CodeMirrorclient(roomID);
    this.WhiteBoard = new WhiteBoard(roomID);
  }
}

export default Collab;
