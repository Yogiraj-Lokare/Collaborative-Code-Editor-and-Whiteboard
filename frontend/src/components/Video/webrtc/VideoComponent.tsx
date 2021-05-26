import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createSocketConnectionInstance } from "./socketConnection";
import SocketConnection from "./socketConnection";
import { CircularProgress } from "@material-ui/core";

const RoomComponent = (props: any) => {
  let socketInstance = useRef<SocketConnection>(null);
  const [micStatus, setMicStatus] = useState(true);
  const [camStatus, setCamStatus] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [displayStream, setDisplayStream] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    return () => {
      socketInstance.current?.destoryConnection();
    };
  }, []);

  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = () => {
    let params = undefined;
    if (!params) params = { quality: 12 };
    //@ts-ignore
    socketInstance.current = createSocketConnectionInstance({
      //@ts-ignore
      updateInstance: updateFromInstance,
      params,
      userDetails,
    });
  };

  const updateFromInstance = (key: string, value: any) => {
    if (key === "streaming") setStreaming(value);
    //@ts-ignore
    //if (key === "message") setMessages([...value]);
    if (key === "displayStream") setDisplayStream(value);
  };

  useLayoutEffect(() => {
    const appBar = document.getElementsByClassName("app-navbar");
    // @ts-ignore
    if (appBar && appBar[0]) appBar[0].style.display = "none";
    return () => {
      // @ts-ignore
      if (appBar && appBar[0]) appBar[0].style.display = "block";
    };
  });

  const handleDisconnect = () => {
    socketInstance.current?.destoryConnection();
  };

  const handleMyMic = () => {
    //@ts-ignore
    const { getMyVideo, reInitializeStream } = socketInstance.current;
    const myVideo = getMyVideo();
    if (myVideo)
      myVideo.srcObject?.getAudioTracks().forEach((track: any) => {
        if (track.kind === "audio")
          // track.enabled = !micStatus;
          micStatus ? track.stop() : reInitializeStream(camStatus, !micStatus);
      });
    setMicStatus(!micStatus);
  };

  const handleMyCam = () => {
    if (!displayStream) {
      //@ts-ignore
      const { toggleVideoTrack } = socketInstance.current;
      toggleVideoTrack({ video: !camStatus, audio: micStatus });
      setCamStatus(!camStatus);
    }
  };
  const toggleScreenShare = () => {
    //@ts-ignore
    const { reInitializeStream, toggleVideoTrack } = socketInstance.current;
    displayStream && toggleVideoTrack({ video: false, audio: true });
    reInitializeStream(
      false,
      true,
      !displayStream ? "displayMedia" : "userMedia"
    ).then(() => {
      setDisplayStream(!displayStream);
      setCamStatus(false);
    });
  };

  return (
    <React.Fragment>
      {!streaming && (
        <div className="stream-loader-wrapper">
          <CircularProgress
            className="stream-loader"
            size={24}
            color="primary"
          />
        </div>
      )}
      <div id="room-container"></div>
      <div className="chat-footbar">
        <div className="footbar-title">Vi CHAT</div>
        <div className="footbar-wrapper">
          {streaming && (
            <div
              className="status-action-btn mic-btn"
              onClick={handleMyMic}
              title={micStatus ? "Disable Mic" : "Enable Mic"}
            >
              {micStatus ? "micon" : "micoff"}
            </div>
          )}
          <div
            className="status-action-btn end-call-btn"
            onClick={handleDisconnect}
            title="End Call"
          >
            Call
          </div>
          {streaming && (
            <div
              className="status-action-btn cam-btn"
              onClick={handleMyCam}
              title={camStatus ? "Disable Cam" : "Enable Cam"}
            >
              {camStatus ? "videocam" : "videocamoff"}
            </div>
          )}
        </div>
        <div>
          <div className="screen-share-btn" onClick={toggleScreenShare}>
            <h4 className="screen-share-btn-text">
              {displayStream ? "Stop Screen Share" : "Share Screen"}
            </h4>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RoomComponent;
