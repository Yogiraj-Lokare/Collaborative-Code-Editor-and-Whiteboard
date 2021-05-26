import React, { useState, useEffect, ChangeEvent } from "react";
import "./App.css";
import { Flex, FormControl, Select, Stack } from "@chakra-ui/react";
import CodeEditor from "./components/codeEditor/codeEditor";
import WhiteBoard from "./components/whiteBoard/WhiteBoard";
import AppHeaderBar from "./components/Appbar/Appbar";
import Footer from "./components/Footer/Footer";
import Video from "./components/Video/Video";
import DashBoard from "./components/Dashboard";
import Page from "./components/pages/mainPage/page";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Page />
      {/* <DashBoard /> */}
      {/* <AppHeaderBar />
      <Flex alignItems="stretch" alignContent="stretch" direction="row">
        <Stack width="50vw">
          <CodeEditor />
        </Stack>
        <Stack width="50vw">
          <WhiteBoard />
        </Stack>
      </Flex>*/}
      {/* <Video /> */}
    </React.Fragment>
  );
};

export default App;
