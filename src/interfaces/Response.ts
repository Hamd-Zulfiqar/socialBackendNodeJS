import { Response } from "express";
import { UserDocument } from "./User";
import { PostDocument } from "./Post";
import { JwtPayload } from "jsonwebtoken";

export interface AuthResponse extends Response {
  decodedData?: JwtPayload | String;
}

export interface UserResponse extends AuthResponse {
  user: UserDocument;
}

export interface PostResponse extends AuthResponse {
  post: PostDocument;
}
