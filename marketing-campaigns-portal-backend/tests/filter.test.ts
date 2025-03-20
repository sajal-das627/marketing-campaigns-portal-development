import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import Filter from "../src/models/Filter";

let authToken: string;
let createdFilterId: string;

// ✅ Before All Tests: Connect to DB & Authenticate User
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  // ✅ Mock Authentication & Get Token
  const loginRes = await request(app).post("/api/auth/okta-login").send({
    email: "testuser@example.com",
    password: "Test@123",
  });
  authToken = loginRes.body.token;
});

// ✅ After All Tests: Disconnect from DB
afterAll(async () => {
  await mongoose.connection.close();
});

// ✅ Test: Create/Update Filter
describe("🚀 Filter Builder APIs", () => {
  it("✅ Should create a new filter", async () => {
    const res = await request(app)
      .post("/api/filters")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "VIP Customers",
        conditions: [{ field: "age", operator: ">", value: "25" }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("filter");
    createdFilterId = res.body.filter._id; // Store for later tests
  });

  // ✅ Test: Edit Filter
  it("✅ Should edit an existing filter", async () => {
    const res = await request(app)
      .put(`/api/filters/${createdFilterId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated VIP Customers",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.filter.name).toBe("Updated VIP Customers");
  });

  // ✅ Test: Duplicate Filter
  it("✅ Should duplicate a filter", async () => {
    const res = await request(app)
      .post(`/api/filters/${createdFilterId}/duplicate`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.filter.name).toContain("Copy of");
  });

  // ✅ Test: Get All Filters
  it("✅ Should fetch all filters", async () => {
    const res = await request(app)
      .get("/api/filters")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // ✅ Test: Preview Audience
  it("✅ Should get an estimated audience", async () => {
    const res = await request(app)
      .post("/api/filters/preview")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        conditions: [{ field: "location", operator: "==", value: "USA" }],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("estimatedAudience");
  });

  // ✅ Test: Delete Filter
  it("✅ Should delete a filter", async () => {
    const res = await request(app)
      .delete(`/api/filters/${createdFilterId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Filter deleted successfully");
  });
});
