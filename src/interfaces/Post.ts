import { Document } from "mongoose";

export interface PostInterface {
  userID: String;
  caption: String;
  image: Buffer;
  createdAt: number;
  updatedAt: number;
}

export interface PostDocument extends PostInterface, Document {}
