import Peer from "peerjs";
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../../socket/socket";

const Video: React.FC = () => {
  useEffect(() => {
    let videoGrid = document.getElementById("video-grid");
    const myPeer = new Peer(undefined, {
      host: "/",
      port: 3001,
    });
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const peers = {};
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);

        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.on("user-disconnected", (userId) => {
      //@ts-ignore
      if (peers[userId]) peers[userId].close();
    });

    myPeer.on("open", (id) => {
      socket.emit("join-room", "video-room", id);
    });

    function connectToNewUser(userId: string, stream: MediaStream) {
      const call = myPeer.call(userId, stream);
      console.log(call);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
      //@ts-ignore
      peers[userId] = call;
    }

    function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
      video.srcObject = stream;
      video.controls = true;
      video.autoplay = true;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid!.append(video);
    }
  }, []);
  return (
    <React.Fragment>
      <div id="video-grid"></div>
    </React.Fragment>
  );
};

export default Video;

/*
class VideoController {
  myPeer: Peer;
  peers: any;
  videoGrid: HTMLElement | null;
  socket: Socket;
  constructor(videoGrid: HTMLElement | null, socket: Socket) {
    this.myPeer = new Peer(undefined, {
      host: "/",
      port: 3001,
    });
    this.peers = {};
    this.socket = socket;
    this.videoGrid = videoGrid;

    const myVideo = document.createElement("video");
    myVideo.muted = true;
    myVideo.controls = true;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.addVideoStream(myVideo, stream);

        this.myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          video.controls = true;
          video.muted = true;
          call.on("stream", (userVideoStream) => {
            this.addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          console.log("userconnected");
          this.connectToNewUser(userId, stream);
        });
      });

    socket.on("user-disconnected", (userId) => {
      if (this.peers[userId]) this.peers[userId].close();
    });

    this.myPeer.on("open", (id) => {
      socket.emit("join-room", "room", id);
    });
  }
  addVideoStream(video: any, stream: MediaStream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    this.videoGrid?.append(video);
  }

  connectToNewUser(userId: string, stream: MediaStream) {
    const call = this.myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      this.addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });

    this.peers[userId] = call;
  }
}
*/
