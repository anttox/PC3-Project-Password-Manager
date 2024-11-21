import mongoose from "mongoose";

beforeEach(async () => {
  await mongoose.disconnect(); // Desconecta cualquier conexión activa
});

afterEach(async () => {
  await mongoose.disconnect();
});

describe("Database Connection", () => {
  it("should connect to MongoDB", async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "password_manager_test",
    });
    expect(connection.connection.readyState).toBe(1); // 1 significa conectado
  });

  it("should fail to connect with an invalid URI", async () => {
    try {
      await mongoose.connect("invalid_uri", { dbName: "test" });
    } catch (error: any) {
      expect(error.message).toContain("Invalid scheme");
    }
  });
});
