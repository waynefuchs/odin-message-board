import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String },
  password_hash: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
