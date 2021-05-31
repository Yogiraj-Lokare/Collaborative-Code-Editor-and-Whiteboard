import Peer from "peerjs";
import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { socket } from "../../../utils/socket/socket";
import RoomComponent from "./webrtc/VideoComponent";

const Video: React.FC = () => {
  useEffect(() => {
    const videoGrid = document.getElementById("video-grid");
    const myPeer = new Peer(undefined, {
      host: "/",
      port: 3001,
    });
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const peers: any = {};
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
          console.log("new user connected ", userId);
          const fc = () => {
            console.log("lets see the deo");
            connectToNewUser(userId, stream);
          };
          setTimeout(fc, 3000);
        });
      });

    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });

    myPeer.on("open", (id) => {
      socket.emit("join-room", "room", id);
    });

    function connectToNewUser(userId: any, stream: MediaStream) {
      const call = myPeer.call(userId, stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });

      peers[userId] = call;
    }

    function addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
      video.srcObject = stream;
      video.autoplay = true;
      console.log(stream);
      video.id = `${Math.random()}`;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      videoGrid?.append(video);
    }
  }, []);
  return (
    <React.Fragment>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 300px)",
          gridAutoRows: "300px",
        }}
        id="video-grid"
      ></div>
      {/* <RoomComponent /> */}
    </React.Fragment>
  );
};

export default Video;
