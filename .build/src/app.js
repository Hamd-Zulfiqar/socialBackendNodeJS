"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as dotenv from "dotenv";
const express = __importStar(require("express"));
const morgan = __importStar(require("morgan"));
const cors = __importStar(require("cors"));
const mongoose_1 = require("mongoose");
const users_1 = __importDefault(require("./routes/users"));
const posts_1 = __importDefault(require("./routes/posts"));
//dotenv.config();
(0, mongoose_1.connect)(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = express.default();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(express.json());
app.use(morgan.default("tiny"));
app.use(cors.default());
if (!module.parent) {
    server.listen(3000, () => {
        console.log("server started....");
    });
}
//Setting basic html for socket connection
app.set("view engine", "ejs");
app.set("socketIO", io);
//ping test
app.get("/ping", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Ping successful!",
    });
});
//Setting up feed write just to see live events log
app.get("/feed", (req, res) => {
    res.render("../dist/views/feed.ejs");
});
//Setting user routes
app.use("/users", users_1.default);
//Setting user routes
app.use("/posts", posts_1.default);
// setting up sockets
io.on("connection", (socket) => {
    console.log("A user is connected with socket id:", socket.id);
});
exports.default = app;
