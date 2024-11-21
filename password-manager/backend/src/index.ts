import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session"; // Importa express-session

dotenv.config();

const app = express();
app.use(express.json());

// Configura express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey", // Utiliza una variable de entorno o un valor por defecto
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializa Passport y gestiona la sesión
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "", {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Google OAuth Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value || "";
        let user = await User.findOne({ email });

        if (!user) {
          const hashedPassword = await bcrypt.hash("defaultPassword", 10);
          user = new User({ email, password: hashedPassword });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

// Routes
app.use("/auth", require("./routes/auth"));

// Export app for testing
export default app;

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
