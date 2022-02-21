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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = __importStar(require("express"));
const app = express.default();
const mongoose = require("mongoose");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(express.json());
server.listen(3000, () => {
    console.log("server started....");
});
app.set("view engine", "ejs");
app.set("socketIO", io);
app.get("/feed", (req, res) => {
    res.render("feed");
});
const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);
const postsRoutes = require("./routes/posts");
app.use("/posts", postsRoutes);
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to db successfully"));
io.on("connection", (socket) => {
    console.log("A user is connected with socket id:", socket.id);
});
//# sourceMappingURL=app.js.map