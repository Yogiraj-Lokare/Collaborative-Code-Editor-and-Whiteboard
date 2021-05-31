//@ts-ignore
import ot from "ot";
import { Socket } from "socket.io";

const cpp = "#include<bits/stdc++.h>\nusing namespace std:\nint main(){\n}";
const javascript = "//write code here";
const java = "//write code here";
const python = "###write code here";

export enum language {
  "cpp" = 0,
  "java" = 1,
  "javascript" = 2,
  "python" = 3,
}

class CodeMirrorclient {
  roomID: string;
  codesnippet: string[];
  selectedLang: language;
  server: any;
  constructor(roomID: string) {
    this.roomID = roomID;
    this.selectedLang = 0;
    this.codesnippet = [];
    this.codesnippet.push(cpp);
    this.codesnippet.push(java);
    this.codesnippet.push(javascript);
    this.codesnippet.push(python);
    this.createServer();
  }
  createServer() {
    this.server = new ot.EditorSocketIOServer(
      this.codesnippet[this.selectedLang],
      [],
      this.roomID
    );
  }
  addUser(socket: Socket, username: string) {
    this.server.addClient(socket);
    this.server.setName(socket, username);
    socket.emit("updateLanguage", this.selectedLang);
  }
  changeLang(language: language) {
    this.codesnippet[this.selectedLang] = this.server.document;
    this.selectedLang = language;
    this.server.setDocument(this.codesnippet[this.selectedLang]);
  }
  EmitDoc(socket: Socket) {
    socket.in(this.roomID).emit("update__", {
      document: this.codesnippet[this.selectedLang],
      language: this.selectedLang,
    });
  }
}

export default CodeMirrorclient;
