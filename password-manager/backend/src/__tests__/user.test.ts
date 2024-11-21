import mongoose, { Schema, Document, CallbackError } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  googleId?: string;
  displayName?: string;
  email: string;
  password?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  googleId: { type: String },
  displayName: { type: String },
  email: { type: String, required: true },
  password: { type: String },
});

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre("save", async function (next: (err?: CallbackError) => void) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Encripta la contraseña
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) {
    throw new Error("Password is not set for this user");
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
