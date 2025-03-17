import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db";

// Wyłączamy process.exit() w testach, żeby nie przerywał testowania
jest.spyOn(process, "exit").mockImplementation(
  (code?: string | number | null | undefined): never => {
    console.log("⛔ process.exit(1) zablokowany w testach");
    throw new Error("process.exit was called with code: " + code);
  }
);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.NODE_ENV = "test"; // 👈 Dodajemy tryb testowy
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

test("Powinno poprawnie połączyć się z bazą danych", async () => {
  await expect(connectDB()).resolves.not.toThrow();
});

test("Powinno zwrócić błąd przy błędnym URL", async () => {
  // Wymuszamy rozłączenie przed testem błędnego URL,
  // aby Mongoose nie korzystał z już nawiązanych połączeń.
  await mongoose.disconnect();
  process.env.MONGO_URI = "mongodb://niepoprawny_adres:27017/test";
  await expect(connectDB()).rejects.toThrow("Błąd połączenia z MongoDB");
});
