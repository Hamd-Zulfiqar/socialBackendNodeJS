import { Schema, model, Types } from "mongoose";
import { PostDocument } from "../interfaces/Post";

const postSchema = new Schema<PostDocument>({
  userID: {
    type: Types.ObjectId,
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

export default model<PostDocument>("Post", postSchema);
