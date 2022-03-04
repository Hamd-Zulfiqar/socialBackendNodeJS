//import * as dotenv from "dotenv";
import * as express from "express";
import { Socket } from "socket.io";
import * as morgan from "morgan";
import * as cors from "cors";
import { connect } from "mongoose";
import usersRoutes from "./routes/users";
import postsRoutes from "./routes/posts";

//dotenv.config();

connect(process.env.DB_URL! as string, {
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
app.use("/users", usersRoutes);

//Setting user routes
app.use("/posts", postsRoutes);

// setting up sockets
io.on("connection", (socket: Socket) => {
  console.log("A user is connected with socket id:", socket.id);
});

export default app;
