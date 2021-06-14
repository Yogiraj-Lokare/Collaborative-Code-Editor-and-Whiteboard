import React, { useState, useEffect, ChangeEvent } from "react";
import "./App.css";
import Page from "./components/pages/mainPage/page";
import { BrowserRouter, Route } from "react-router-dom";
import MainApp from "./components/HomePage/index";
import { SetTokenHeader } from "./utils/Auth";
import Video from "./components/pages/Video/Video";
import { Jitsi__ } from "./components/pages/Video/jitsi-meet";

const App: React.FC = () => {
  SetTokenHeader();
  return (
    <React.Fragment>
      {/* <Jitsi__ /> */}
      <BrowserRouter>
        <Route path="/" exact={true} component={MainApp} />
        <Route
          path="/interview/:name/:email/:roomID"
          exact={true}
          component={Page}
        />
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
