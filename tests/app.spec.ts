import { expect } from "chai";
import { Application } from "express";
import request from "supertest";
import createServer from "../src/app";

const app = createServer();
request.agent(app.listen());

describe("Main File Tests", () => {
  it("server is running successfully!", async () => {
    const response = await request(app).get("/ping");

    expect(response.body.success).to.equal(true);
  });
});
