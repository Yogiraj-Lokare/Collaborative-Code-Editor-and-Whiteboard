import User from "../model/User";
//@ts-ignore
import jwt from "jsonwebtoken";
import { NextFunction } from "express";

const auth = async function (req: any, res: any, next: NextFunction) {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decoded = await jwt.verify(token, "secretkey");
    const user = await User.findOne({ _id: decoded.id });
    if (!user) throw new Error("No such user");
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    return next({
      status: 401,
      message: "do login first",
    });
  }
};

export default auth;
