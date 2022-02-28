import { Response } from "express";
import { UserDocument, UserInterface } from "./User";
import { PostInterface } from "./Post";
import { JwtPayload } from "jsonwebtoken";

export interface AuthResponse extends Response {
  decodedData?: JwtPayload | String;
}

export interface UserResponse extends AuthResponse {
  user: UserDocument;
}

export interface PostResponse extends AuthResponse {
  post: PostInterface;
}
