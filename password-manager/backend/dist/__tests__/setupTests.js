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
const index_1 = require("../index");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.test" });
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const mongoUri = process.env.TEST_MONGO_URI;
    if (!mongoUri) {
        throw new Error("TEST_MONGO_URI no está configurada en el archivo .env.test");
    }
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect(); // Desconectar si ya existe una conexión activa
    }
    yield mongoose_1.default.connect(mongoUri, {
        dbName: "password_manager_test",
    });
    console.log("Conectado a la base de datos de pruebas");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect(); // Desconectar de MongoDB
    if (index_1.server) {
        index_1.server.close(() => {
            console.log("Servidor cerrado después de las pruebas");
        });
    }
}));
