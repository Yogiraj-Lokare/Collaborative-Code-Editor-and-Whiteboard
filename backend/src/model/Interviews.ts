import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    interviewer: {
      type: String,
      lowercase: true,
      required: true,
    },
    roomID: {
      type: String,
      required: true,
    },
    participents: [
      {
        name: {
          type: String,
          lowercase: true,
          required: true,
        },
        email: {
          type: String,
          lowercase: true,
          required: true,
        },
      },
    ],
    start_time: {
      type: Date,
    },
    end_time: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Interviews = mongoose.model("Interviews", schema);
export default Interviews;
