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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_session_1 = __importDefault(require("express-session")); // Importa express-session
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Configura express-session
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "yourSecretKey", // Utiliza una variable de entorno o un valor por defecto
    resave: false,
    saveUninitialized: true,
}));
// Inicializa Passport y gestiona la sesión
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGO_URI || "", {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
// Mongoose User Schema
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose_1.default.model("User", userSchema);
// Google OAuth Configuration
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || "";
        let user = yield User.findOne({ email });
        if (!user) {
            const hashedPassword = yield bcrypt_1.default.hash("defaultPassword", 10);
            user = new User({ email, password: hashedPassword });
            yield user.save();
        }
        done(null, user);
    }
    catch (err) {
        console.error("Error in Google Strategy:", err);
        done(err, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
// Routes
app.use("/auth", require("./routes/auth"));
// Export app for testing
exports.default = app;
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
