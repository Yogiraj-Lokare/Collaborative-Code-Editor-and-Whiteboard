class WhiteBoard {
  /**
   * contains list of drawing operations
   */
  OperationsList: DrawingOperation[] = [];
  roomID: string;

  constructor(roomID: string) {
    this.roomID = roomID;
  }
  AddNewOperation = (operation: DrawingOperation) => {
    this.OperationsList.push(operation);
  };
  GetAllOperations = () => {
    return this.OperationsList;
  };
  ClearOperations = () => {
    this.OperationsList = [];
  };
}

export default WhiteBoard;

interface DrawingOperation {
  color: string;
  size: number;
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
}
