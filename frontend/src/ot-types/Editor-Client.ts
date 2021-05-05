import UndoManager from "./Undo-Manager";
import WrappedOperation from "./Wrapped-Operation";
import Client from "./Client";
import TextOperation from "./Text-Operation";
import Selection from "./Selection";
import SocketIOAdapter from "./Socketio-Adapter";
import CodeMirrorAdapter from "./Codemirror-Adapter";

export class SelfMeta {
  selectionBefore: Selection;
  selectionAfter: Selection;
  constructor(selectionBefore: Selection, selectionAfter: Selection) {
    this.selectionBefore = selectionBefore;
    this.selectionAfter = selectionAfter;
  }
  invert() {
    return new SelfMeta(this.selectionAfter, this.selectionBefore);
  }
  compose(other: any) {
    return new SelfMeta(this.selectionBefore, other.selectionAfter);
  }
  transform(operation: any) {
    return new SelfMeta(
      this.selectionBefore.transform(operation),
      this.selectionAfter.transform(operation)
    );
  }
}

class OtherMeta {
  clientId: any;
  selection: any;
  constructor(clientId: any, selection: any) {
    this.clientId = clientId;
    this.selection = selection;
  }
  transform(operation: any) {
    return new OtherMeta(
      this.clientId,
      this.selection && this.selection.transform(operation)
    );
  }
  static fromJSON(obj: any) {
    return new OtherMeta(
      obj.clientId,
      obj.selection && Selection.fromJSON(obj.selection)
    );
  }
}

class OtherClient {
  id: string;
  listEl: HTMLElement;
  editorAdapter: CodeMirrorAdapter;
  name!: string;
  li: HTMLLIElement;
  hue!: number;
  color!: string;
  lightColor: any;
  selection: any;
  mark!: { clear: () => void } | null;
  constructor(
    id: string,
    listEl: HTMLElement,
    editorAdapter: CodeMirrorAdapter,
    name?: string,
    selection?: Selection | null | undefined
  ) {
    this.id = id;
    this.listEl = listEl;
    this.editorAdapter = editorAdapter;
    if (name !== undefined) this.name = name;

    this.li = document.createElement("li");
    if (name) {
      this.li.textContent = name;
      this.listEl.appendChild(this.li);
    }

    this.setColor(name ? hueFromName(name) : Math.random());
    if (selection) {
      this.updateSelection(selection);
    }
  }
  setColor(hue: number) {
    this.hue = hue;
    this.color = hsl2hex(hue, 0.75, 0.5);
    this.lightColor = hsl2hex(hue, 0.5, 0.9);
    if (this.li) {
      this.li.style.color = this.color;
    }
  }
  setName(name: string) {
    if (this.name === name) {
      return;
    }
    this.name = name;

    this.li.textContent = name;
    if (!this.li.parentNode) {
      this.listEl.appendChild(this.li);
    }

    this.setColor(hueFromName(name));
  }
  updateSelection(selection: any) {
    this.removeSelection();
    this.selection = selection;
    this.mark = this.editorAdapter.setOtherSelection(
      selection,
      selection.position === selection.selectionEnd
        ? this.color
        : this.lightColor,
      this.id
    );
  }
  remove() {
    if (this.li) {
      removeElement(this.li);
    }
    this.removeSelection();
  }
  removeSelection() {
    if (this.mark) {
      this.mark.clear();
      this.mark = null;
    }
  }
}

class EditorClient extends Client {
  serverAdapter: SocketIOAdapter;
  editorAdapter: CodeMirrorAdapter;
  undoManager: UndoManager;
  clients: any;
  clientListEl!: HTMLElement;
  selection: any;
  state: any;
  constructor(
    revision: number,
    clients: any,
    serverAdapter: SocketIOAdapter,
    editorAdapter: CodeMirrorAdapter
  ) {
    //Client.call(this, revision);
    super(revision);
    //super(this,revision);
    this.serverAdapter = serverAdapter;
    this.editorAdapter = editorAdapter;
    this.undoManager = new UndoManager();

    this.initializeClientList();
    this.initializeClients(clients);

    var self = this;

    this.editorAdapter.registerCallbacks({
      change: function (operation: any, inverse: any) {
        self.onChange(operation, inverse);
      },
      selectionChange: function () {
        self.onSelectionChange();
      },
      blur: function () {
        self.onBlur();
      },
    });
    this.editorAdapter.registerUndo(function () {
      self.undo();
    });
    this.editorAdapter.registerRedo(function () {
      self.redo();
    });

    this.serverAdapter.registerCallbacks({
      client_left: function (clientId: any) {
        self.onClientLeft(clientId);
      },
      set_name: function (clientId: any, name: any) {
        self.getClientObject(clientId).setName(name);
      },
      ack: function () {
        self.serverAck();
      },
      operation: function (operation: any) {
        self.applyServer(TextOperation.fromJSON(operation));
      },
      selection: function (clientId: any, selection: any) {
        if (selection) {
          self
            .getClientObject(clientId)
            .updateSelection(
              self.transformSelection(Selection.fromJSON(selection))
            );
        } else {
          self.getClientObject(clientId).removeSelection();
        }
      },
      clients: function (clients: any) {
        var clientId;
        for (clientId in self.clients) {
          if (
            self.clients.hasOwnProperty(clientId) &&
            !clients.hasOwnProperty(clientId)
          ) {
            self.onClientLeft(clientId);
          }
        }

        for (clientId in clients) {
          if (clients.hasOwnProperty(clientId)) {
            var clientObject = self.getClientObject(clientId);

            if (clients[clientId].name) {
              clientObject.setName(clients[clientId].name);
            }

            var selection = clients[clientId].selection;
            if (selection) {
              self.clients[clientId].updateSelection(
                self.transformSelection(Selection.fromJSON(selection))
              );
            } else {
              self.clients[clientId].removeSelection();
            }
          }
        }
      },
      reconnect: function () {
        self.serverReconnect();
      },
    });
    //this.revision = undefined;
  }
  addClient(clientId: string, clientObj: any) {
    this.clients[clientId] = new OtherClient(
      clientId,
      this.clientListEl,
      this.editorAdapter,
      clientObj.name || clientId,
      clientObj.selection ? Selection.fromJSON(clientObj.selection) : null
    );
  }
  initializeClients(clients: any) {
    this.clients = {};
    for (var clientId in clients) {
      if (clients.hasOwnProperty(clientId)) {
        this.addClient(clientId, clients[clientId]);
      }
    }
  }
  getClientObject(clientId: string) {
    var client = this.clients[clientId];
    if (client) {
      return client;
    }
    return (this.clients[clientId] = new OtherClient(
      clientId,
      this.clientListEl,
      this.editorAdapter
    ));
  }
  onClientLeft(clientId: string) {
    console.log("User disconnected: " + clientId);
    var client = this.clients[clientId];
    if (!client) {
      return;
    }
    client.remove();
    delete this.clients[clientId];
  }
  initializeClientList() {
    this.clientListEl = document.createElement("ul");
  }
  applyUnredo(operation: any) {
    this.undoManager.add(operation.invert(this.editorAdapter.getValue()));
    this.editorAdapter.applyOperation(operation.wrapped);
    this.selection = operation.meta.selectionAfter;
    this.editorAdapter.setSelection(this.selection);
    this.applyClient(operation.wrapped);
  }
  undo() {
    var self = this;
    if (!this.undoManager.canUndo()) {
      return;
    }
    this.undoManager.performUndo(function (o: any) {
      self.applyUnredo(o);
    });
  }
  redo() {
    var self = this;
    if (!this.undoManager.canRedo()) {
      return;
    }
    this.undoManager.performRedo(function (o: any) {
      self.applyUnredo(o);
    });
  }
  onChange(textOperation: TextOperation, inverse: TextOperation) {
    var selectionBefore = this.selection;
    this.updateSelection();
    var meta = new SelfMeta(selectionBefore, this.selection);
    var operation = new WrappedOperation(textOperation, meta);

    var compose =
      this.undoManager.undoStack.length > 0 &&
      inverse.shouldBeComposedWithInverted(
        last(this.undoManager.undoStack).wrapped
      );
    var inverseMeta = new SelfMeta(this.selection, selectionBefore);
    this.undoManager.add(new WrappedOperation(inverse, inverseMeta), compose);
    this.applyClient(textOperation);
  }
  updateSelection() {
    this.selection = this.editorAdapter.getSelection();
  }
  onSelectionChange() {
    var oldSelection = this.selection;
    this.updateSelection();
    if (oldSelection && this.selection.equals(oldSelection)) {
      return;
    }
    this.sendSelection(this.selection);
  }
  onBlur() {
    this.selection = null;
    this.sendSelection(null);
  }
  sendSelection(selection: Selection | null) {
    if (this.state instanceof EditorClient.AwaitingWithBuffer) {
      return;
    }
    if (selection !== null) this.serverAdapter.sendSelection(selection);
  }
  sendOperation(revision: any, operation: any) {
    this.serverAdapter.sendOperation(
      revision,
      operation.toJSON(),
      this.selection
    );
  }
  applyOperation(operation: TextOperation) {
    this.editorAdapter.applyOperation(operation);
    this.updateSelection();
    this.undoManager.transform(new WrappedOperation(operation, null));
  }
}

//inherit(EditorClient, Client);

function rgb2hex(r: number, g: number, b: number) {
  function digits(n: number) {
    var m = Math.round(255 * n).toString(16);
    return m.length === 1 ? "0" + m : m;
  }
  return "#" + digits(r) + digits(g) + digits(b);
}

function hsl2hex(h: number, s: number, l: number) {
  if (s === 0) {
    return rgb2hex(l, l, l);
  }
  var var2 = l < 0.5 ? l * (1 + s) : l + s - s * l;
  var var1 = 2 * l - var2;
  var hue2rgb = function (hue: number) {
    if (hue < 0) {
      hue += 1;
    }
    if (hue > 1) {
      hue -= 1;
    }
    if (6 * hue < 1) {
      return var1 + (var2 - var1) * 6 * hue;
    }
    if (2 * hue < 1) {
      return var2;
    }
    if (3 * hue < 2) {
      return var1 + (var2 - var1) * 6 * (2 / 3 - hue);
    }
    return var1;
  };
  return rgb2hex(hue2rgb(h + 1 / 3), hue2rgb(h), hue2rgb(h - 1 / 3));
}

function hueFromName(name: string) {
  var a = 1;
  for (var i = 0; i < name.length; i++) {
    a = (17 * (a + name.charCodeAt(i))) % 360;
  }
  return a / 360;
}

// Set Const.prototype.__proto__ to Super.prototype
// function inherit (Const, Super) {
//   function F () {}
//   F.prototype = Super.prototype;
//   Const.prototype = new F();
//   Const.prototype.constructor = Const;
// }

function last(arr: string | any[]) {
  return arr[arr.length - 1];
}

// Remove an element from the DOM.
function removeElement(el: HTMLLIElement) {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

export default EditorClient;
