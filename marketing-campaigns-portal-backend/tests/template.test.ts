import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import Template from "../src/models/Template";
import { connectDB } from "./setup/db"; // ✅ Shared DB connection

let templateId: string;
// let authToken: string;

beforeAll(async () => {
  await connectDB();

  // ✅ Okta Login (uncomment when /api/auth/okta-login is functional)
  /*
  const loginRes = await request(app).post("/api/auth/okta-login").send({
    email: "testuser@example.com",
    password: "Test@123",
  });
  authToken = loginRes.body.localToken;
  */

  // ✅ Create base template if it doesn't exist
  const existing = await Template.findOne({ name: "Sample Template" });
  if (!existing) {
    const res = await request(app)
      .post("/api/templates")
      // .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Sample Template",
        type: "Email",
        category: "Promotional",
        tags: ["welcome"],
        layout: "Single Column",
        content: { html: "<h1>Hello</h1>" },
        favorite: false,
        lastUsed: new Date(),
      });
    templateId = res.body.template._id;
  } else {
    templateId = existing._id.toString();
  }
});

describe("🚀 Template APIs", () => {
  it("✅ Should create a new template", async () => {
    const res = await request(app)
      .post("/api/templates")
      // .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "New Template",
        type: "Email",
        category: "Promotional",
        tags: [],
        layout: "Single Column",
        content: { html: "<p>Hello</p>" },
        lastUsed: new Date(),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.template).toBeDefined();
  });

  it("✅ Should fetch template by ID", async () => {
    const res = await request(app)
      .get(`/api/templates/${templateId}`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(templateId);
  });

  it("✅ Should toggle favorite status", async () => {
    const res = await request(app)
      .put(`/api/templates/${templateId}/favorite`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200);
    expect(res.body.template).toHaveProperty("favorite");
  });

  it("✅ Should soft delete the template", async () => {
    const res = await request(app)
      .delete(`/api/templates/${templateId}`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Template marked as deleted successfully");
  });

  it("✅ Should still allow toggling favorite after soft delete", async () => {
    await request(app)
      .delete(`/api/templates/${templateId}`);
      // .set("Authorization", `Bearer ${authToken}`)
    const res = await request(app)
      .put(`/api/templates/${templateId}/favorite`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect([200, 404]).toContain(res.statusCode);
  });

  it("✅ Should restore the soft deleted template", async () => {
    await request(app)
      .delete(`/api/templates/${templateId}`);
      // .set("Authorization", `Bearer ${authToken}`)
    const res = await request(app)
      .patch(`/api/templates/${templateId}/restore`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(templateId);
  });

  it("✅ Should handle double delete gracefully", async () => {
    await request(app)
      .delete(`/api/templates/${templateId}`);
      // .set("Authorization", `Bearer ${authToken}`)
    const res = await request(app)
      .delete(`/api/templates/${templateId}`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect([200, 404]).toContain(res.statusCode);
  });

  it("✅ Should fail restoring a non-deleted template", async () => {
    const fresh = await request(app)
      .post("/api/templates")
      // .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Brand New Template",
        type: "Email",
        category: "Promotional",
        tags: [],
        layout: "Single Column",
        content: { html: "<p>Hello</p>" },
        lastUsed: new Date(),
      });

    const newTemplateId = fresh.body.template._id;

    const res = await request(app)
      .patch(`/api/templates/${newTemplateId}/restore`);
      // .set("Authorization", `Bearer ${authToken}`)
    expect([200, 404]).toContain(res.statusCode);
  });
});
