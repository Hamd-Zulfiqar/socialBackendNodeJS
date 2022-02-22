import { Schema, model, Document } from "mongoose";
import { PostInterface } from "../interfaces/Post";

const postSchema = new Schema<PostInterface & Document>({
  userID: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
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

module.exports = model("Post", postSchema);
