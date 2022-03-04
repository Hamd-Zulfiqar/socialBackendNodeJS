import { expect } from "chai";
import request from "supertest";
import app from "../../src/app";
import connectDB from "../../src/database";

let user: any;
let newUser: any;

describe("Post Controller Tests", () => {
  before(async () => {
    await connectDB();
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
    it("Authentication failed", async () => {
      const response = await request(app)
        .get("/posts/user?id=" + user._id)
        .set("Authorize", "Bearer " + user.token);
      expect(response.body.message).to.equal("Authentication Failed");
    });
    it("Success", async () => {
      const response = await request(app)
        .get("/posts/user?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.length).to.equal(2);
    });
  });

  describe("Get feed for a user", () => {
    it("User not found", async () => {
      const response = await request(app)
        .get("/posts/feed?id=56cb91bdc3464f14678934ca")
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.message).to.equal("User not found");
    });
    it("Success", async () => {
      const response = await request(app)
        .get("/posts/feed?id=" + user._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.length).to.equal(0);
    });
  });

  describe("Create post for a user", () => {
    it("User not found", async () => {
      const response = await request(app)
        .post("/posts/create")
        .set("Authorization", "Bearer " + user.token)
        .send({
          userID: "56cb91bdc3464f14678934ca",
          caption: "TEST!",
        });
      expect(response.body.message).to.equal("Cannot find user");
    });
    it("Success", async () => {
      const response = await request(app)
        .post("/posts/create")
        .set("Authorization", "Bearer " + user.token)
        .send({
          userID: user._id,
          caption: "Test Message!",
        });
      console.log("RES: ", response);
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
    it("Post not found!", async () => {
      const response = await request(app)
        .post("/posts/update/56cb91bdc3464f14678934ca")
        .set("Authorization", "Bearer " + user.token)
        .send({ caption: "Message Updated!" });
      expect(response.body.message).to.equal("Cannot find post");
    });
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
