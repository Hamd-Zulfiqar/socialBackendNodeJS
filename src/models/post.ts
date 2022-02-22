import { Schema, model, Document } from "mongoose";
import { Post } from "../interfaces/Post";

const postSchema = new Schema<Post & Document>({
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
