import * as jwt from "jsonwebtoken";
import { Request, NextFunction, Response } from "express";
import { AuthResponse } from "../../interfaces/Response";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = res as AuthResponse;
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token)
      return response.status(401).json({ message: "Authentication Failed" });
    response.decodedData = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
    next();
  } catch (error: any) {
    return response.status(401).json({ message: "Authentication Failed" });
  }
};
