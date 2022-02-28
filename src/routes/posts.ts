import { Router, Request, Response, NextFunction } from "express";
import { PostInterface } from "../interfaces/Post";
import { PostResponse } from "../interfaces/Response";
//const Post = require("../models/post");
import Post from "../models/post";
const User = require("../models/user");
const authentication = require("./middleware/authentication");
const router = Router();

//Get all posts
router.get("/", async (req: Request, res: Response) => {
  try {
    const posts: PostInterface[] = await Post.find();
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//Get all posts for a user
router.get("/user", authentication, async (req, res) => {
  try {
    const posts: PostInterface[] = await Post.find({ userID: req.query.id });
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//Get feed for a user
router.get("/feed", authentication, async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  const limit = 3;
  try {
    const user = await User.findById(req.query.id);
    if (user === null)
      return res.status(401).json({ message: "User not found" });
    let posts = await Post.find({
      userID: { $in: user.followingList },
    })
      .skip(((page as number) - 1) * limit)
      .limit(limit);
    if (req.query.filter)
      posts = posts.filter((post: PostInterface) =>
        post.caption.includes(req.query.filter as string)
      );
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//Create post
router.post("/create", authentication, async (req: Request, res: Response) => {
  const post = new Post({
    userID: req.body.userID,
    caption: req.body.caption,
  });
  try {
    const user = await User.findById(req.body.userID);
    if (user === null)
      return res.status(404).json({ message: "Cannot find user" });
    const newPost = await post.save();
    const io = req.app.get("socketIO");
    io.emit("postAdded", newPost.toObject());
    res.json(newPost);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//Get post
router.get("/:id", authentication, getPost, (req: Request, res: Response) => {
  const response = res as PostResponse;
  res.json(response.post);
});

//Delete post
router.get(
  "/delete/:id",
  authentication,
  getPost,
  async (req: Request, res: Response) => {
    const response = res as PostResponse;
    try {
      await response.post.remove();
      res.json({ message: "Post deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

//Update Post
router.post(
  "/update/:id",
  authentication,
  getPost,
  async (req: Request, res: Response) => {
    const response = res as PostResponse;
    if (req.body.caption != null) {
      response.post.caption = req.body.caption;
    }
    response.post.updatedAt = Date.now();
    try {
      const updatedPost = await response.post.save();
      res.json(updatedPost);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

//Middleware to get the post from ID
async function getPost(req: Request, res: Response, next: NextFunction) {
  const response = res as PostResponse;
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post === null) {
      return response.status(404).json({ message: "Cannot find post" });
    }
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
  response.post = post;
  next();
}

module.exports = router;
