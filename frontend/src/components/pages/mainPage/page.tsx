import { Flex, Stack } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import CodeEditor from "../../codeEditor/codeEditor";
import { ReflexContainer, ReflexElement, ReflexSplitter } from "react-reflex";
import Chat from "../../Chat/chat";
import AppHeaderBar from "../../Appbar/Appbar";
import { Button, IconButton } from "@chakra-ui/button";
import Footer from "../../Footer/Footer";
const Page = () => {
  return (
    <React.Fragment>
      <AppHeaderBar />
      <div style={{ display: "flex" }}>
        <ReflexContainer
          style={{ display: "flex", width: "75vw" }}
          orientation="vertical"
        >
          <ReflexElement>
            <CodeEditor />
          </ReflexElement>
          <ReflexSplitter
            style={{
              cursor: "e-resize",
              width: "1vw",
              height: "85vh",
              backgroundColor: "lightgrey",
            }}
          />
          <ReflexElement>
            <Chat />
          </ReflexElement>
        </ReflexContainer>
        <div style={{ width: "25vw" }}>
          <VideoContainer>
            <VideoComponent _id="1" />
            <VideoComponent _id="2" />
          </VideoContainer>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Page;

const VideoContainer = ({ children }: any) => {
  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: "#eee",
          overflowY: "auto",
          height: "85vh",
        }}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

type Props = {
  _id: string | undefined;
};

const VideoComponent: React.FC<Props> = (props: Props) => {
  // useEffect(() => {
  //   //@ts-ignore
  //   var pre: HTMLVideoElement = document.getElementById(`${props._id}`);
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       video: true,
  //     })
  //     .then((stream) => {
  //       pre.srcObject = stream;
  //     });
  //   pre.autoplay = true;
  // }, []);
  return (
    <React.Fragment>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "4fr 1fr",
          margin: "0.8vw 1vw",
          minWidth: "20vw",
          backgroundColor: "#bbb",
          borderRadius: "10px",
        }}
      >
        <div>
          <video
            id={props._id}
            controls
            style={{
              width: "100%",
              height: "15vw",
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              backgroundColor: "transparent",
            }}
          ></video>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div>
            <Button borderRadius="full" backgroundColor="red.200">
              Video
            </Button>
          </div>
          <div>
            <Button borderRadius="full" backgroundColor="red.400">
              Audio
            </Button>
          </div>
          <div>
            <Button borderRadius="full" backgroundColor="messenger.400">
              Control
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
