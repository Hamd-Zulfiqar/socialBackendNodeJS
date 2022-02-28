import { expect } from "chai";
import { Application } from "express";
import request from "supertest";
import createServer from "../src/app";

const app = createServer();

describe("Main File Tests", () => {
  before(() => {});
  it("server is running successfully!", async () => {
    console.log("LOL", app);
  });

  it("ping test", async () => {
    const response = await request(app).get("/ping");

    expect(response.body.success).to.equal(true);
  });
});
