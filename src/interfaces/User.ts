import { Document } from "mongoose";
export interface UserInterface {
  name: string;
  email: string;
  password: string;
  DOB: Date;
  gender: string;
  followingList: String[];
  createdAt: Date;
  updatedAt: Date;
}
