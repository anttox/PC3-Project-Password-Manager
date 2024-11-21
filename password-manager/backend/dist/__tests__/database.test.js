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
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect(); // Desconecta cualquier conexión activa
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
describe("Database Connection", () => {
    it("should connect to MongoDB", () => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield mongoose_1.default.connect(process.env.MONGO_URI || "", {
            dbName: "password_manager_test",
        });
        expect(connection.connection.readyState).toBe(1); // 1 significa conectado
    }));
    it("should fail to connect with an invalid URI", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect("invalid_uri", { dbName: "test" });
        }
        catch (error) {
            expect(error.message).toContain("Invalid scheme");
        }
    }));
});
