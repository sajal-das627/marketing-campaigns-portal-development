import request from "supertest";
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
});
