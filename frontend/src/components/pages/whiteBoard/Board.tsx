import React from "react";
import { socket } from "../../../utils/socket/socket";
import { Socket } from "socket.io-client";
import { Operation, Props } from "../../../types";
class Board extends React.Component<Props> {
  socket: Socket;
  ctx!: CanvasRenderingContext2D | null;
  leftt: number;
  topp: number;
  reset: boolean;
  room: string;
  constructor(props: Props) {
    super(props);
    this.room = props.room;
    this.socket = socket;
    this.leftt = props.lef;
    this.reset = false;
    this.topp = props.top;
    this.socket.on("new-op", (operation: Operation) => {
      this.applyNewOperation(operation);
    });
    this.socket.on("clear-board", this.clearboard);
    this.socket.emit("init-board", { room: this.room });
    this.socket.on("get-all-ops", (operations: Operation[]) => {
      operations.map((operation) => {
        this.applyNewOperation(operation);
      });
    });
  }

  clearboard = () => {
    var sketch = document.getElementById("sketch");
    var sketch_style = getComputedStyle(sketch!);
    let image = new ImageData(
      parseInt(sketch_style.getPropertyValue("width")),
      parseInt(sketch_style.getPropertyValue("height"))
    );
    this.ctx?.putImageData(image, 0, 0);
  };

  componentDidMount() {
    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.reset != this.reset) {
      socket.emit("reset-board", { room: this.room });
      this.clearboard();
      this.reset = newProps.reset;
    }
    this.leftt = newProps.lef;
    this.topp = newProps.top;
    this.ctx!.strokeStyle = newProps.color;
    this.ctx!.lineWidth = newProps.size;
  }

  applyNewOperation(operation: Operation) {
    if (this.ctx === undefined) return;
    if (this.ctx === null) return;
    let myColor = this.ctx.strokeStyle;
    let mySize = this.ctx.lineWidth;
    this.ctx.strokeStyle = operation.color;
    this.ctx.lineWidth = operation.size;
    this.ctx.beginPath();
    this.ctx.moveTo(operation.from.x, operation.from.y);
    this.ctx.lineTo(operation.to.x, operation.to.y);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.strokeStyle = myColor;
    this.ctx.lineWidth = mySize;
  }

  drawOnCanvas() {
    var root = this;
    //@ts-ignore
    var canvas: HTMLCanvasElement = document.getElementById("board");
    this.ctx = canvas!.getContext("2d");
    var ctx = this.ctx;
    var sketch = document.getElementById("sketch");
    var sketch_style = getComputedStyle(sketch!);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */

    canvas.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
      },
      false
    );

    /* Drawing on Paint App */
    if (ctx == null) {
      return;
    }
    ctx.lineWidth = this.props.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = this.props.color;
    canvas.addEventListener(
      "mousedown",
      function (e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    var onPaint = function () {
      if (ctx == null) return;
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      root.socket.emit("new_operation", {
        room: root.room,
        operation: {
          color: root.ctx!.strokeStyle,
          size: root.ctx!.lineWidth,
          from: { x: last_mouse.x, y: last_mouse.y },
          to: { x: mouse.x, y: mouse.y },
        },
      });
    };
  }

  render() {
    return (
      <div className="sketch" id="sketch">
        <canvas className="board" id="board"></canvas>
      </div>
    );
  }
}

export default Board;
