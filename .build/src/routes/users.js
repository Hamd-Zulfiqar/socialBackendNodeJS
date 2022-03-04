"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const validatorSchemas_1 = require("./middleware/validators/validatorSchemas");
const authentication_1 = require("./middleware/authentication");
const validation_1 = require("./middleware/validation");
const router = (0, express_1.Router)();
//Get all users
router.get("/", async (req, res) => {
    try {
        const users = await user_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Create user
router.post("/signup", (0, validation_1.validator)(validatorSchemas_1.object.signup), async (req, res) => {
    try {
        const payload = req.body;
        const existingUser = await user_1.default.findOne({
            email: payload.email,
        });
        if (existingUser != null)
            return res.status(400).json({ message: "User already exists" });
        const hash = await bcrypt_1.default.hash(payload.password, 10);
        const user = new user_1.default({
            name: payload.name,
            email: payload.email,
            password: hash,
            DOB: payload.DOB,
            gender: payload.gender,
        });
        const newUser = await user.save();
        res.json(newUser.toObject());
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Get User
router.post("/login", (0, validation_1.validator)(validatorSchemas_1.object.login), async (req, res) => {
    try {
        const user = await user_1.default.findOne({ email: req.body.email });
        if (user == null)
            return res.status(401).json({ message: "Invalid credentials" });
        const result = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!result)
            return res.status(401).json({ message: "Invalid credentials" });
        const loggedInUser = await user.save();
        res.json(Object.assign(Object.assign({}, loggedInUser.toObject()), { token: getToken(loggedInUser.email, loggedInUser.id) }));
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//Get User
router.get("/:id", authentication_1.authentication, getUser, (req, res) => {
    const response = res;
    response.json(response.user);
});
//Delete User
router.delete("/delete/:id", authentication_1.authentication, getUser, async (req, res) => {
    const response = res;
    try {
        await response.user.remove();
        response.json({ message: "User deleted" });
    }
    catch (error) {
        response.status(500).json({ message: error.message });
    }
});
//Update User
router.put("/update/:id", (0, validation_1.validator)(validatorSchemas_1.object.user.updateSchema), authentication_1.authentication, getUser, async (req, res) => {
    const response = res;
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
    }
    catch (error) {
        response.status(400).json({ message: error.message });
    }
});
//Follow User
router.post("/follow", (0, validation_1.validator)(validatorSchemas_1.object.user.followUser), authentication_1.authentication, async (req, res) => {
    try {
        const user = await user_1.default.findById(req.body.userID);
        if (user === null)
            return res.status(404).json({ message: "Cannot find user" });
        if (user.followingList.length &&
            user.followingList.includes(req.body.followerID))
            return res.status(400).json({ message: "Already a follower" });
        user.followingList.push(req.body.followerID);
        res.json(await user.save());
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//Unfollow User
router.post("/unfollow", (0, validation_1.validator)(validatorSchemas_1.object.user.followUser), authentication_1.authentication, async (req, res) => {
    try {
        const user = await user_1.default.findById(req.body.userID);
        if (user === null)
            return res.status(404).json({ message: "Cannot find user" });
        const followingList = user.followingList.filter((id) => id !== req.body.followerID);
        user.followingList = followingList;
        res.json(await user.save());
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
//Middleware to get the user from ID
async function getUser(req, res, next) {
    const response = res;
    let user;
    try {
        user = await user_1.default.findById(req.params.id);
        if (user === null)
            return response.status(404).json({ message: "Cannot find user" });
    }
    catch (error) {
        return response.status(500).json({ message: error.message });
    }
    response.user = user;
    next();
}
function getToken(email, id) {
    const token = (0, jsonwebtoken_1.sign)({ email, id }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: "2d",
    });
    return token;
}
exports.default = router;
