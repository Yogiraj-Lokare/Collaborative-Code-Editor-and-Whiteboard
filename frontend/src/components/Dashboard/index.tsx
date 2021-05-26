import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Card } from "@material-ui/core";
import React from "react";

const DashBoard = () => {
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          alignContent: "center",
        }}
      >
        <div
          style={{
            boxShadow:
              "rgb(18 0 0 / 9%) 2px 10px 19px -1px, rgb(0 0 0 / 14%) 0px 1px 102px 12px, rgb(0 0 0 / 12%) 0px 5px 1px -9px",
            padding: "2vw",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "2vw",
              marginBottom: "2vw",
            }}
          >
            Welcome
          </div>
          <div style={{ width: "25vw" }}>
            <div style={{ marginBottom: "3vh" }}>
              <Input
                _focus={{ borderColor: "red" }}
                type="text"
                placeholder="name"
              ></Input>
            </div>
            <div style={{ marginBottom: "2vh" }}>
              <Input type="text" placeholder="password"></Input>
            </div>
          </div>
          <div
            style={{
              padding: "1vw",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "15vw", textAlign: "center" }}>
              <Button
                backgroundColor="red.100"
                style={{
                  padding: "1vw",
                  borderRadius: "6px",
                  width: "100%",
                }}
              >
                Login
              </Button>
            </div>
          </div>
          <div
            style={{
              padding: "1vw",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "15vw", textAlign: "center" }}>
              <Button
                backgroundColor="red.300"
                _hover={{ backgroundColor: "red.200" }}
                _active={{ backgroundColor: "red.200" }}
                style={{
                  padding: "1vw",
                  borderRadius: "6px",
                  width: "100%",
                }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashBoard;
