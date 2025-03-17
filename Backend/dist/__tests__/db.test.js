"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const db_1 = __importDefault(require("../config/db"));
// Wyłączamy process.exit() w testach, żeby nie przerywał testowania
jest.spyOn(process, "exit").mockImplementation((code) => {
    console.log("⛔ process.exit(1) zablokowany w testach");
    throw new Error("process.exit was called with code: " + code);
});
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    process.env.NODE_ENV = "test"; // 👈 Dodajemy tryb testowy
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    yield mongoServer.stop();
}));
test("Powinno poprawnie połączyć się z bazą danych", () => __awaiter(void 0, void 0, void 0, function* () {
    yield expect((0, db_1.default)()).resolves.not.toThrow();
}));
test("Powinno zwrócić błąd przy błędnym URL", () => __awaiter(void 0, void 0, void 0, function* () {
    // Wymuszamy rozłączenie przed testem błędnego URL,
    // aby Mongoose nie korzystał z już nawiązanych połączeń.
    yield mongoose_1.default.disconnect();
    process.env.MONGO_URI = "mongodb://niepoprawny_adres:27017/test";
    yield expect((0, db_1.default)()).rejects.toThrow("Błąd połączenia z MongoDB");
}));
