import React from "react";
import { socket } from "../../socket/socket";
import { Socket } from "socket.io-client";
import { SendCursorPosition } from "../../socket/socketEvents";
import { Operation, Props } from "../../types";
class Board extends React.Component<Props> {
  timeout: any;
  socket: Socket;
  ctx: any;
  isDrawing = false;
  leftt: number;
  topp: number;
  constructor(props: Props) {
    super(props);
    this.socket = socket;
    this.leftt = props.lef;
    this.topp = props.top;
    this.socket.on("new_operation", (operation: Operation) => {
      this.applyNewOperation(operation);
    });
  }

  componentDidMount() {
    this.drawOnCanvas();
  }

  componentWillReceiveProps(newProps: Props) {
    this.leftt = newProps.lef;
    this.topp = newProps.top;
    this.ctx.strokeStyle = newProps.color;
    this.ctx.lineWidth = newProps.size;
  }

  applyNewOperation(operation: Operation) {
    if (this.ctx === undefined) return;
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
    var canvas = document.querySelector("#board");
    //@ts-ignore
    this.ctx = canvas?.getContext("2d");
    var ctx = this.ctx;
    var sketch = document.querySelector("#sketch");
    //@ts-ignore
    var sketch_style = getComputedStyle(sketch);
    //@ts-ignore
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    //@ts-ignore
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */

    //@ts-ignore
    canvas.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;
        //@ts-ignore
        mouse.x = e.pageX - this.offsetLeft;
        //@ts-ignore
        mouse.y = e.pageY - this.offsetTop;
        //@ts-ignore
      },
      false
    );

    /* Drawing on Paint App */
    //@ts-ignore
    ctx.lineWidth = this.props.size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    //@ts-ignore
    ctx.strokeStyle = this.props.color;
    //@ts-ignore
    canvas.addEventListener(
      "mousedown",
      function (e) {
        //@ts-ignore
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );
    //@ts-ignore
    canvas.addEventListener(
      "mouseup",
      function () {
        //@ts-ignore
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      root.socket.emit("draw_operation", {
        color: root.ctx.strokeStyle,
        size: root.ctx.lineWidth,
        from: { x: last_mouse.x, y: last_mouse.y },
        to: { x: mouse.x, y: mouse.y },
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
