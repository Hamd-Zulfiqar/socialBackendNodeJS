let jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
import { Router, Request, Response, NextFunction } from "express";
import { ObjectId } from "mongoose";
import { UserResponse } from "../interfaces/Response";
// const User = require("../models/user");
import User from "../models/user";
import { UserDocument, UserInterface } from "../interfaces/User";
const authentication = require("./middleware/authentication");

const router = Router();

//Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users: UserDocument[] = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//Create user
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const payload: UserInterface = req.body;
    const existingUser = await User.findOne({
      email: payload.email,
    });
    if (existingUser != null)
      return res.status(400).json({ message: "User already exists" });
    const hash: string = await bcrypt.hash(payload.password, 10);
    const user: UserDocument = new User({
      name: payload.name,
      email: payload.email,
      password: hash,
      DOB: payload.DOB,
      gender: payload.gender,
    });
    const newUser: UserDocument = await user.save();
    res.json(newUser.toObject());
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//Get User
router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user == null)
      return res.status(401).json({ message: "Invalid credentials" });
    const result: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!result)
      return res.status(401).json({ message: "Invalid credentials" });
    const loggedInUser: UserDocument = await user.save();
    res.json({
      ...loggedInUser.toObject(),
      token: getToken(loggedInUser.email, loggedInUser.id),
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//Get User
router.get("/:id", authentication, getUser, (req: Request, res: Response) => {
  const response = res as UserResponse;
  response.json(response.user);
});

//Delete User
router.get(
  "/delete/:id",
  authentication,
  getUser,
  async (req: Request, res: Response) => {
    const response = res as UserResponse;
    try {
      await response.user?.remove();
      response.json({ message: "User deleted" });
    } catch (error: any) {
      response.status(500).json({ message: error.message });
    }
  }
);

//Update User
router.post(
  "/update/:id",
  authentication,
  getUser,
  async (req: Request, res: Response) => {
    const response = res as UserResponse;
    if (req.body.name != null) {
      response.user.name = req.body.name;
    }
    if (req.body.email != null) {
      response.user.email = req.body.email;
    }
    response.user.updatedAt = Date.now();
    try {
      const updatedUser = await response.user.save();
      response.json(updatedUser);
    } catch (error: any) {
      response.status(400).json({ message: error.message });
    }
  }
);

//Follow User
router.post("/follow", authentication, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userID);
    if (user === null)
      return res.status(404).json({ message: "Cannot find user" });
    if (
      user.followingList.length &&
      user.followingList.includes(req.body.followerID)
    )
      return res.status(400).json({ message: "Already a follower" });
    user.followingList.push(req.body.followerID);
    res.json(await user.save());
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

//Unfollow User
router.post(
  "/unfollow",
  authentication,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.body.userID);
      if (user === null)
        return res.status(404).json({ message: "Cannot find user" });
      const followingList = user.followingList.filter(
        (id) => id !== req.body.followerID
      );
      user.followingList = followingList;
      res.json(await user.save());
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

//Middleware to get the user from ID
async function getUser(req: Request, res: Response, next: NextFunction) {
  const response = res as UserResponse;
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user === null)
      return response.status(404).json({ message: "Cannot find user" });
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
  response.user = user;
  next();
}

function getToken(email: string, id: string) {
  const token = jwt.sign({ email, id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "2d",
  });
  return token;
}

module.exports = router;
