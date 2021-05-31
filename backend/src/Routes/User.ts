import express, { response } from "express";
import mongoose from "mongoose";
import User, { findByCredentials } from "../model/User";
const app = express.Router();

app.post("/signup", async (req, res, next) => {
  try {
    const user = new User(req.body);
    const token = await user.generateToken();
    res.send({ Email: user.email, Username: user.username, token });
  } catch (e) {
    res.send(e);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const user = await findByCredentials(req.body.email, req.body.password);
    if (user.message != undefined) {
      res.send({ message: "failed" });
      return;
    }

    const token = await user.generateToken();
    res.send({ Email: user.email, Username: user.username, token });
  } catch (e) {
    res.send(e);
  }
});

export default app;
