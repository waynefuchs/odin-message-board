import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String },
  password_hash: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
