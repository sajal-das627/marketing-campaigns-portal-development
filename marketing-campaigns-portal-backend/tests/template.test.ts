/*import request from "supertest";
import app from "../src/app";

describe("🚀 Template Management API", () => {
  it("should create a new template", async () => {
    const res = await request(app)
      .post("/api/templates")
      .send({
        name: "Welcome Email",
        subject: "Welcome to Our Service",
        content: "<h1>Hi {{firstName}}, welcome aboard!</h1>"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("name", "Welcome Email");
  });

  it("should fetch all templates", async () => {
    const res = await request(app).get("/api/templates");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should delete a template", async () => {
    const createRes = await request(app)
      .post("/api/templates")
      .send({
        name: "Test Template",
        subject: "Test",
        content: "<p>Test</p>"
      });

    const templateId = createRes.body._id;
    const deleteRes = await request(app).delete(`/api/templates/${templateId}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe("Template deleted successfully");
  });
});*/

import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Template from "../src/models/Template";

let authToken: string;
let createdTemplateId: string;

// ✅ Before All Tests: Connect to DB & Authenticate User
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  // ✅ Mock Authentication & Get Token
  const loginRes = await request(app).post("/api/auth/okta-login").send({
    email: "testuser@example.com",
    password: "Test@123",
  });
  // authToken = loginRes.body.token;
});

// ✅ After All Tests: Disconnect from DB
afterAll(async () => {
  await mongoose.connection.close();
});

// ✅ Test: Fetch All Templates
describe("🚀 Template APIs", () => {
  it("✅ Should fetch all templates", async () => {
    const res = await request(app)
      .get("/api/templates")
      // .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Fetch Recently Used Templates
  it("✅ Should fetch recently used templates", async () => {
    const res = await request(app)
      .get("/api/templates/recent")
      // .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Fetch Past Campaign Templates
  it("✅ Should fetch past campaign templates", async () => {
    const res = await request(app)
      .get("/api/templates/past")
      // .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Toggle Favorite Status
  it("✅ Should toggle favorite status of a template", async () => {
    // Create a sample template first
    const templateRes = await request(app)
      .post("/api/templates")
      // .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "New Template",
        category: "Marketing",
        type: "Basic",
        layout: "Single Column",
      });

    expect(templateRes.statusCode).toBe(201);
    createdTemplateId = templateRes.body.template._id;

    // Toggle favorite status
    const res = await request(app)
      .put(`/api/templates/${createdTemplateId}/favorite`)
      // .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Template favorite status updated");
  });
});

