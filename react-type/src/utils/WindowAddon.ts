import EditorClient from "../ot/editor-client";

class WindowAddon extends Window {
  static cmClient: EditorClient;
  static update(document: string) {
    this.cmClient.revision = 0;
    this.cmClient.editorAdapter.ignoreNextChange = true;
    this.cmClient.editorAdapter.cm.setValue(document);
    this.cmClient.undoManager.redoStack = [];
    this.cmClient.undoManager.undoStack = [];
  }
}

export default WindowAddon;
