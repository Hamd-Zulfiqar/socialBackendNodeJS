import { expect } from "chai";
import { Application } from "express";
import request from "supertest";
import startServer from "../../src/app";

let app: Application;
let user: any;
let newUser: any;

describe("Post Controller Tests", () => {
  before(async () => {
    app = await startServer();
    const login = await request(app)
      .post("/users/login")
      .send({ email: "hamd@social.com", password: "hamd" });

    user = login.body;
  });

  describe("Fetch all posts", () => {
    it("Success", async () => {
      const response = await request(app).get("/posts");
      expect(response.body.length).to.equal(2);
    });
  });

  describe("Fetch all posts for a user", () => {
    it("Success", async () => {
      const response = await request(app)
        .get("/posts/user?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.length).to.equal(2);
    });
  });

  describe("Get feed for a user", () => {
    it("Success", async () => {
      const response = await request(app)
        .get("/posts/feed?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.length).to.equal(0);
    });
  });

  describe("Create post for a user", () => {
    it("Success", async () => {
      const response = await request(app)
        .post("/posts/create")
        .set("Authorization", "Bearer " + user.token)
        .send({
          userID: user._id,
          caption: "Test Message!",
        });
      expect(response.body.caption).to.equal("Test Message!");
    });
  });

  describe("Get post by ID", () => {
    it("Success", async () => {
      const post = await request(app)
        .get("/posts/user?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      const response = await request(app)
        .get("/posts/" + post.body[0]._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.caption).to.equal("First Message!");
    });
  });

  describe("Update post by ID", () => {
    it("Success", async () => {
      const post = await request(app)
        .get("/posts/user?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      const response = await request(app)
        .post("/posts/update/" + post.body[2]._id)
        .set("Authorization", "Bearer " + user.token)
        .send({ caption: "Message Updated!" });
      expect(response.body.caption).to.equal("Message Updated!");
    });
  });

  describe("Delete post by ID", () => {
    it("Success", async () => {
      const post = await request(app)
        .get("/posts/user?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      const response = await request(app)
        .delete("/posts/delete/" + post.body[2]._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.message).to.equal("Post deleted");
    });
  });
});
