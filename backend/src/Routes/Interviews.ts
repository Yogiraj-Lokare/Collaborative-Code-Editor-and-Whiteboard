import express from "express";
import auth from "../Middleware/auth";
import Interviews from "../model/Interviews";

const app = express.Router();

app.post("/shedule", auth, async (req, res) => {
  try {
    let interviewShedule = new Interviews(req.body);
    await interviewShedule.save();
    res.send({ message: "success" });
  } catch (e) {
    res.send(e);
  }
});

app.get("/myinterviews", auth, async (req, res) => {
  try {
    const interviewsList = await Interviews.find({
      //@ts-ignore
      interviewer: req.user.email,
    });
    res.send(interviewsList);
  } catch (e) {
    res.send(e);
  }
});

app.post("/verifyuser", auth, async (req, res) => {
  try {
  } catch (e) {
    res.send(e);
  }
});

export default app;
