import request from "supertest";
import app from "../index";

describe("Auth Routes", () => {
  it("should redirect to Google authentication", async () => {
    const response = await request(app).get("/auth/google");
    expect(response.status).toBe(302);
    expect(response.headers.location).toContain("https://accounts.google.com/o/oauth2/auth");
  });
});