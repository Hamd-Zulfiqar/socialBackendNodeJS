// const jwt = require("jsonwebtoken");
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

module.exports = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Authentication Failed" });
    res.decodedData = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
    next();
  } catch (error: any) {
    return res.status(401).json({ message: "Authentication Failed" });
  }
};
