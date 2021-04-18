import { Socket } from "socket.io-client";
class SocketIOAdapter {
  socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;

    var self = this;
    socket
      .on("client_left", function (clientId) {
        //@ts-ignore
        self.trigger("client_left", clientId);
      })
      .on("set_name", function (clientId, name) {
        //@ts-ignore
        self.trigger("set_name", clientId, name);
      })
      .on("ack", function () {
        self.trigger("ack");
      })
      .on("operation", function (clientId, operation, selection) {
        //@ts-ignore
        self.trigger("operation", operation);
        //@ts-ignore
        self.trigger("selection", clientId, selection);
      })
      .on("selection", function (clientId, selection) {
        //@ts-ignore
        self.trigger("selection", clientId, selection);
      })
      .on("reconnect", function () {
        self.trigger("reconnect");
      });
  }
  sendOperation(revision, operation, selection) {
    this.socket.emit("operation", revision, operation, selection);
  }
  sendSelection(selection) {
    this.socket.emit("selection", selection);
  }
  registerCallbacks(cb) {
    //@ts-ignore
    this.callbacks = cb;
  }
  trigger(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    //@ts-ignore
    var action = this.callbacks && this.callbacks[event];
    if (action) {
      action.apply(this, args);
    }
  }
}

export default SocketIOAdapter;
