import * as Joi from "joi";
import { Request, NextFunction, Response } from "express";

export const validator = (validator: Joi.Schema) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await validator.validateAsync(req.body);
      console.log("Validation successful!", validated);
      next();
    } catch (err) {
      return res.status(500).json({ message: "API Body validation Failed" });
    }
  };
};
