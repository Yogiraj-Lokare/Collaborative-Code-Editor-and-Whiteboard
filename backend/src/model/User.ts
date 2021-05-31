import mongoose from "mongoose";
//@ts-ignore
import jwt from "jsonwebtoken";
const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.methods.generateToken = async function () {
  const user = this;
  const id = user._id;
  const token = await jwt.sign({ id }, "secretkey");
  await user.save();
  return token;
};

export const findByCredentials = async function (
  email: string,
  password: string
) {
  const user = await User.findOne({ email });
  if (!user) return new Error("No such email in database");

  if (user.password === password) return user;

  return new Error("password did not match");
};

const User = mongoose.model("User", schema);
export default User;
