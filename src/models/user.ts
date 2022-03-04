// const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import { UserDocument } from "../interfaces/User";

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  followingList: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

export default model<UserDocument>("User", userSchema);
