import WrappedOperation from "./Wrapped-Operation";

var NORMAL_STATE = "normal";
var UNDOING_STATE = "undoing";
var REDOING_STATE = "redoing";

// Create a new UndoManager with an optional maximum history size.
class UndoManager {
  maxItems: any;
  state: string;
  dontCompose: boolean;
  undoStack: any[];
  redoStack: any[];
  constructor(maxItems?: number | undefined) {
    this.maxItems = maxItems || 50;
    this.state = NORMAL_STATE;
    this.dontCompose = false;
    this.undoStack = [];
    this.redoStack = [];
  }
  // Add an operation to the undo or redo stack, depending on the current state
  // of the UndoManager. The operation added must be the inverse of the last
  // edit. When `compose` is true, compose the operation with the last operation
  // unless the last operation was alread pushed on the redo stack or was hidden
  // by a newer operation on the undo stack.
  add(operation: WrappedOperation, compose?: any) {
    if (this.state === UNDOING_STATE) {
      this.redoStack.push(operation);
      this.dontCompose = true;
    } else if (this.state === REDOING_STATE) {
      this.undoStack.push(operation);
      this.dontCompose = true;
    } else {
      var undoStack = this.undoStack;
      if (!this.dontCompose && compose && undoStack.length > 0) {
        undoStack.push(operation.compose(undoStack.pop()));
      } else {
        undoStack.push(operation);
        if (undoStack.length > this.maxItems) {
          undoStack.shift();
        }
      }
      this.dontCompose = false;
      this.redoStack = [];
    }
  }
  // Transform the undo and redo stacks against a operation by another client.
  transform(operation: WrappedOperation) {
    this.undoStack = transformStack(this.undoStack, operation);
    this.redoStack = transformStack(this.redoStack, operation);
  }
  // Perform an undo by calling a function with the latest operation on the undo
  // stack. The function is expected to call the `add` method with the inverse
  // of the operation, which pushes the inverse on the redo stack.
  performUndo(fn: any) {
    this.state = UNDOING_STATE;
    if (this.undoStack.length === 0) {
      throw new Error("undo not possible");
    }
    fn(this.undoStack.pop());
    this.state = NORMAL_STATE;
  }
  // The inverse of `performUndo`.
  performRedo(fn: any) {
    this.state = REDOING_STATE;
    if (this.redoStack.length === 0) {
      throw new Error("redo not possible");
    }
    fn(this.redoStack.pop());
    this.state = NORMAL_STATE;
  }
  // Is the undo stack not empty?
  canUndo() {
    return this.undoStack.length !== 0;
  }
  // Is the redo stack not empty?
  canRedo() {
    return this.redoStack.length !== 0;
  }
  // Whether the UndoManager is currently performing an undo.
  isUndoing() {
    return this.state === UNDOING_STATE;
  }
  // Whether the UndoManager is currently performing a redo.
  isRedoing() {
    return this.state === REDOING_STATE;
  }
}

function transformStack(stack: any, operation: any) {
  var newStack = [];
  var Operation = operation.constructor;
  for (var i = stack.length - 1; i >= 0; i--) {
    var pair = Operation.transform(stack[i], operation);
    if (typeof pair[0].isNoop !== "function" || !pair[0].isNoop()) {
      newStack.push(pair[0]);
    }
    operation = pair[1];
  }
  return newStack.reverse();
}

export default UndoManager;