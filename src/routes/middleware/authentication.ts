// const jwt = require("jsonwebtoken");
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Put it in env
const secretKey = "socialSecretKey";

module.exports = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Authentication Failed" });
    res.decodedData = jwt.verify(token, secretKey);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication Failed" });
  }
};
