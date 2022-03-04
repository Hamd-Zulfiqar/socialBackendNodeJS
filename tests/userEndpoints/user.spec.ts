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

  it("login test", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({ email: "hamd@social.com", password: "hamd" });
    expect(response.body.name).to.equal("Hamd");
  });

  it("signUp test", async () => {
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

  it("get by ID test", async () => {
    const response = await request(app)
      .get("/users/" + user._id)
      .set("Authorization", "Bearer " + user.token);
    expect(response.body.name).to.equal("Hamd");
  });

  it("update user test", async () => {
    const response = await request(app)
      .put("/users/update/" + user._id)
      .set("Authorization", "Bearer " + user.token)
      .send({ name: "Hamd", email: "hamd@social.com" });
    expect(response.body.name).to.equal("Hamd");
  });

  it("follow user test", async () => {
    const response = await request(app)
      .post("/users/follow")
      .set("Authorization", "Bearer " + user.token)
      .send({ userID: user._id, followerID: newUser._id });
    expect(response.body.name).to.equal("Hamd");
  });

  it("un-follow user test", async () => {
    const response = await request(app)
      .post("/users/unfollow")
      .set("Authorization", "Bearer " + user.token)
      .send({ userID: user._id, followerID: newUser._id });
    expect(response.body.name).to.equal("Hamd");
  });

  it("delete user test", async () => {
    const response = await request(app)
      .delete("/users/delete/" + newUser._id)
      .set("Authorization", "Bearer " + user.token);
    expect(response.body.message).to.equal("User deleted");
  });
});
