import request from "supertest";
import app from "../src/app";

describe("🚀 Authentication API", () => {
  it("should fail login with missing credentials", async () => {
    const res = await request(app).post("/api/auth/okta-login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
