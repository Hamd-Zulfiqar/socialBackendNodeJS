import { expect } from "chai";
import request from "supertest";
import app from "../../src/app";
import connectDB from "../../src/database";

let user: any;
let newUser: any;

describe("User Controller Tests", () => {
  before(async () => {
    await connectDB();
    const login = await request(app)
      .post("/users/login")
      .send({ email: "hamd@social.com", password: "hamd" });

    user = login.body;
  });

  after(async () => {});

  describe("Fetch all users", () => {
    it("Success", async () => {
      const response = await request(app).get("/users");
      expect(response.body.length).to.equal(2);
    });
  });

  describe("Login test", () => {
    it("Validation Middleware failed", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "hamd@social.com" });
      expect(response.body.message).to.equal("API Body validation Failed");
    });
    it("User not found", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "ham@social.com", password: "lol" });
      expect(response.body.message).to.equal("Invalid credentials");
    });
    it("Invalid Credentials", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "hamd@social.com", password: "lol" });
      expect(response.body.message).to.equal("Invalid credentials");
    });
    it("Success", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "hamd@social.com", password: "hamd" });
      expect(response.body.name).to.equal("Hamd");
    });
  });

  describe("Sign up test", () => {
    it("user already exists", async () => {
      const response = await request(app).post("/users/signup").send({
        email: "hamd@social.com",
        password: "hassan",
        name: "Hassan",
        DOB: "08/09/1997",
        gender: true,
      });
      expect(response.body.message).to.equal("User already exists");
    });
    it("success", async () => {
      const response = await request(app).post("/users/signup").send({
        email: "hassan4@social.com",
        password: "hassan",
        name: "Hassan",
        DOB: "08/09/1997",
        gender: true,
      });
      newUser = response.body;
      expect(response.body.name).to.equal("Hassan");
    });
  });

  describe("Get by ID test", () => {
    it("Authentication failed!", async () => {
      const response = await request(app)
        .get("/users/" + user._id)
        .set("Authorize", "Bearer " + user.token);
      expect(response.body.message).to.equal("Authentication Failed");
    });
    it("Success", async () => {
      const response = await request(app)
        .get("/users/" + user._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.name).to.equal("Hamd");
    });
  });

  it("update user test", async () => {
    const response = await request(app)
      .put("/users/update/" + user._id)
      .set("Authorization", "Bearer " + user.token)
      .send({ name: "Hamd", email: "hamd@social.com" });
    expect(response.body.name).to.equal("Hamd");
  });

  describe("follow user test", () => {
    it("user does not exist", async () => {
      const response = await request(app)
        .post("/users/follow")
        .set("Authorization", "Bearer " + user.token)
        .send({ userID: "56cb91bdc3464f14678934ca", followerID: newUser._id });
      expect(response.body.message).to.equal("Cannot find user");
    });
    it("success", async () => {
      const response = await request(app)
        .post("/users/follow")
        .set("Authorization", "Bearer " + user.token)
        .send({ userID: user._id, followerID: newUser._id });
      expect(response.body.name).to.equal("Hamd");
    });
    it("already followed", async () => {
      const response = await request(app)
        .post("/users/follow")
        .set("Authorization", "Bearer " + user.token)
        .send({ userID: user._id, followerID: newUser._id });
      expect(response.body.message).to.equal("Already a follower");
    });
  });

  describe("un-follow user test", () => {
    it("success", async () => {
      const response = await request(app)
        .post("/users/unfollow")
        .set("Authorization", "Bearer " + user.token)
        .send({ userID: user._id, followerID: newUser._id });
      expect(response.body.name).to.equal("Hamd");
    });
  });

  describe("delete user test", () => {
    it("success", async () => {
      const response = await request(app)
        .delete("/users/delete/" + newUser._id)
        .set("Authorization", "Bearer " + user.token);
      expect(response.body.message).to.equal("User deleted");
    });
  });
});
