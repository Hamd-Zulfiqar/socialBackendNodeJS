import { Document } from "mongoose";
export interface UserInterface {
  name: string;
  email: string;
  password: string;
  DOB: Date;
  gender: boolean;
  followingList: String[];
  createdAt?: number;
  updatedAt?: number;
}

export interface UserDocument extends UserInterface, Document {}
