// translation of https://github.com/djspiewak/cccp/blob/master/agent/src/main/scala/com/codecommit/cccp/agent/state.scala
// Client constructor
class Client {
  static Synchronized: typeof Synchronized;
  static AwaitingWithBuffer: typeof AwaitingWithBuffer;
  revision: number;
  state: any;
  static AwaitingConfirm: typeof AwaitingConfirm;
  constructor(revision: number) {
    this.revision = revision; // the next expected revision number
    this.state = synchronized_; // start state
  }
  setState(state: any) {
    this.state = state;
  }
  // Call this method when the user changes the document.
  applyClient(operation: any) {
    this.setState(this.state.applyClient(this, operation));
  }
  // Call this method with a new operation from the server
  applyServer(operation: any) {
    this.revision++;
    this.setState(this.state.applyServer(this, operation));
  }
  serverAck() {
    this.revision++;
    this.setState(this.state.serverAck(this));
  }
  serverReconnect() {
    if (typeof this.state.resend === "function") {
      this.state.resend(this);
    }
  }
  // Transforms a selection from the latest known server state to the current
  // client state. For example, if we get from the server the information that
  // another user's cursor is at position 3, but the server hasn't yet received
  // our newest operation, an insertion of 5 characters at the beginning of the
  // document, the correct position of the other user's cursor in our current
  // document is 8.
  transformSelection(selection: any) {
    return this.state.transformSelection(selection);
  }
  // Override this method.
  sendOperation(revision: any, operation: any) {
    throw new Error("sendOperation must be defined in child class");
  }
  // Override this method.
  applyOperation(operation: any) {
    throw new Error("applyOperation must be defined in child class");
  }
}

// In the 'Synchronized' state, there is no pending operation that the client
// has sent to the server.
class Synchronized {
  resend: any;
  constructor() {}
  applyClient(client: any, operation: any) {
    // When the user makes an edit, send the operation to the server and
    // switch to the 'AwaitingConfirm' state
    client.sendOperation(client.revision, operation);
    return new AwaitingConfirm(operation);
  }
  applyServer(client: any, operation: any) {
    // When we receive a new operation from the server, the operation can be
    // simply applied to the current document
    client.applyOperation(operation);
    return this;
  }
  serverAck(client: any) {
    throw new Error("There is no pending operation.");
  }
  // Nothing to do because the latest server state and client state are the same.
  transformSelection(x: any) {
    return x;
  }
}
Client.Synchronized = Synchronized;

// Singleton
var synchronized_ = new Synchronized();

// In the 'AwaitingConfirm' state, there's one operation the client has sent
// to the server and is still waiting for an acknowledgement.
class AwaitingConfirm {
  outstanding: any;
  constructor(outstanding: any) {
    // Save the pending operation
    this.outstanding = outstanding;
  }
  applyClient(client: any, operation: any) {
    // When the user makes an edit, don't send the operation immediately,
    // instead switch to 'AwaitingWithBuffer' state
    return new AwaitingWithBuffer(this.outstanding, operation);
  }
  applyServer(client: any, operation: any) {
    // This is another client's operation. Visualization:
    //
    //                   /\
    // this.outstanding /  \ operation
    //                 /    \
    //                 \    /
    //  pair[1]         \  / pair[0] (new outstanding)
    //  (can be applied  \/
    //  to the client's
    //  current document)
    var pair = operation.constructor.transform(this.outstanding, operation);
    client.applyOperation(pair[1]);
    return new AwaitingConfirm(pair[0]);
  }
  serverAck(client: any) {
    // The client's operation has been acknowledged
    // => switch to synchronized state
    return synchronized_;
  }
  transformSelection(selection: any) {
    return selection.transform(this.outstanding);
  }
  resend(client: any) {
    // The confirm didn't come because the client was disconnected.
    // Now that it has reconnected, we resend the outstanding operation.
    client.sendOperation(client.revision, this.outstanding);
  }
}
Client.AwaitingConfirm = AwaitingConfirm;

// In the 'AwaitingWithBuffer' state, the client is waiting for an operation
// to be acknowledged by the server while buffering the edits the user makes
class AwaitingWithBuffer {
  outstanding: any;
  buffer: any;
  constructor(outstanding: any, buffer: any) {
    // Save the pending operation and the user's edits since then
    this.outstanding = outstanding;
    this.buffer = buffer;
  }
  applyClient(client: any, operation: any) {
    // Compose the user's changes onto the buffer
    var newBuffer = this.buffer.compose(operation);
    return new AwaitingWithBuffer(this.outstanding, newBuffer);
  }
  applyServer(client: any, operation: any) {
    // Operation comes from another client
    //
    //                       /\
    //     this.outstanding /  \ operation
    //                     /    \
    //                    /\    /
    //       this.buffer /  \* / pair1[0] (new outstanding)
    //                  /    \/
    //                  \    /
    //          pair2[1] \  / pair2[0] (new buffer)
    // the transformed    \/
    // operation -- can
    // be applied to the
    // client's current
    // document
    //
    // * pair1[1]
    var transform = operation.constructor.transform;
    var pair1 = transform(this.outstanding, operation);
    var pair2 = transform(this.buffer, pair1[1]);
    client.applyOperation(pair2[1]);
    return new AwaitingWithBuffer(pair1[0], pair2[0]);
  }
  serverAck(client: any) {
    // The pending operation has been acknowledged
    // => send buffer
    client.sendOperation(client.revision, this.buffer);
    return new AwaitingConfirm(this.buffer);
  }
  transformSelection(selection: any) {
    return selection.transform(this.outstanding).transform(this.buffer);
  }
  resend(client: any) {
    // The confirm didn't come because the client was disconnected.
    // Now that it has reconnected, we resend the outstanding operation.
    client.sendOperation(client.revision, this.outstanding);
  }
}
Client.AwaitingWithBuffer = AwaitingWithBuffer;

export default Client;
