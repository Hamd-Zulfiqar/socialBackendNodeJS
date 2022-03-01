require("dotenv").config();
// const express = require("express");
import * as express from "express";
import { Socket } from "socket.io";
import * as morgan from "morgan";
import connectDB from "./database";

export default async function startServer() {
  const app = express.default();
  const server = require("http").createServer(app);
  const io = require("socket.io")(server);

  app.use(express.json());
  app.use(morgan.default("tiny"));
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

  await connectDB();

  //Setting user routes
  const usersRoutes = require("./routes/users");
  app.use("/users", usersRoutes);

  //Setting user routes
  const postsRoutes = require("./routes/posts");
  app.use("/posts", postsRoutes);

  // setting up sockets
  io.on("connection", (socket: Socket) => {
    console.log("A user is connected with socket id:", socket.id);
  });

  return app;
}

startServer();
