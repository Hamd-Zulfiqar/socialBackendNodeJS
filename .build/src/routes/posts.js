"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = __importDefault(require("../models/post"));
const validatorSchemas_1 = require("./middleware/validators/validatorSchemas");
const user_1 = __importDefault(require("../models/user"));
const authentication_1 = require("./middleware/authentication");
const validation_1 = require("./middleware/validation");
const router = (0, express_1.Router)();
//Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await post_1.default.find();
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Get all posts for a user
router.get("/user", authentication_1.authentication, async (req, res) => {
    try {
        const userID = req.query.id;
        const posts = await post_1.default.find({ userID });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Get feed for a user
router.get("/feed", authentication_1.authentication, async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 3;
    try {
        const user = await user_1.default.findById(req.query.id);
        if (user === null)
            return res.status(401).json({ message: "User not found" });
        let posts = await post_1.default.find({
            userID: { $in: user.followingList },
        })
            .skip((page - 1) * limit)
            .limit(limit);
        if (req.query.filter)
            posts = posts.filter((post) => post.caption.includes(req.query.filter));
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Create post
router.post("/create", (0, validation_1.validator)(validatorSchemas_1.object.post.createPost), authentication_1.authentication, async (req, res) => {
    const post = new post_1.default({
        userID: req.body.userID,
        caption: req.body.caption,
    });
    console.log("POST: ", post);
    try {
        const user = await user_1.default.findById(req.body.userID);
        if (user === null)
            return res.status(404).json({ message: "Cannot find user" });
        const newPost = await post.save();
        const io = req.app.get("socketIO");
        io.emit("postAdded", newPost.toObject());
        res.json(newPost);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Get post
router.get("/:id", authentication_1.authentication, getPost, (req, res) => {
    const response = res;
    res.json(response.post);
});
//Delete post
router.delete("/delete/:id", authentication_1.authentication, getPost, async (req, res) => {
    const response = res;
    try {
        await response.post.remove();
        res.json({ message: "Post deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Update Post
router.post("/update/:id", (0, validation_1.validator)(validatorSchemas_1.object.post.updatePost), authentication_1.authentication, getPost, async (req, res) => {
    const response = res;
    if (req.body.caption != null) {
        response.post.caption = req.body.caption;
    }
    response.post.updatedAt = Date.now();
    try {
        const updatedPost = await response.post.save();
        res.json(updatedPost);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Middleware to get the post from ID
async function getPost(req, res, next) {
    const response = res;
    let post;
    try {
        post = await post_1.default.findById(req.params.id);
        if (post === null) {
            return response.status(404).json({ message: "Cannot find post" });
        }
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
    response.post = post;
    next();
}
exports.default = router;
