import { expect } from "chai";
import { Application } from "express";
import request from "supertest";
import startServer from "../src/app";

let app: Application;

describe("Main File Tests", () => {
  before(async () => {
    app = await startServer();
  });

  it("ping test", async () => {
    const response = await request(app).get("/ping");

    expect(response.body.success).to.equal(true);
  });
});
