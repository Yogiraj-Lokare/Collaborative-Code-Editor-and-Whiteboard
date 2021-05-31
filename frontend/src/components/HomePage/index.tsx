import React, { useEffect } from "react";
import AuthHomePage from "./AuthHomePage";
import HomePage from "./Homepage";

const MainApp = () => {
  useEffect(() => {}, [localStorage]);
  return (
    <React.Fragment>
      {localStorage.getItem("email") && localStorage.getItem("username") ? (
        <HomePage />
      ) : (
        <AuthHomePage />
      )}
    </React.Fragment>
  );
};

export default MainApp;
