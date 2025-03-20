/*import request from "supertest";
import app from "../src/app";

describe("🚀 Authentication API", () => {
  it("should fail login with missing credentials", async () => {
    const res = await request(app).post("/api/auth/okta-login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
}); */

import request from "supertest";
import app from "../src/app";

describe("🚀 Authentication API", () => {
  // ✅ Test: Login should fail with missing credentials
  it("❌ Should fail login with missing credentials", async () => {
    const res = await request(app).post("/api/auth/okta-login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // ✅ Test: Login should fail with invalid credentials
  it("❌ Should fail login with incorrect email or password", async () => {
    const res = await request(app).post("/api/auth/okta-login").send({
      email: "wronguser@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  // ✅ Test: Login should succeed with valid credentials
  it("✅ Should login successfully with correct credentials", async () => {
    const validUser = {
      email: "testuser@example.com",
      password: "Test@123",
    };

    const res = await request(app).post("/api/auth/okta-login").send(validUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  // ✅ Test: Access protected route without authentication
  it("❌ Should block access to protected route without token", async () => {
    const res = await request(app).get("/api/protected-route");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  // ✅ Test: Access protected route with authentication
  it("✅ Should access protected route with valid token", async () => {
    const loginRes = await request(app).post("/api/auth/okta-login").send({
      email: "testuser@example.com",
      password: "Test@123",
    });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/protected-route")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Protected route accessed");
  });
});

