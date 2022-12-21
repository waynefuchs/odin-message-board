import mongoose from "mongoose";

// `password` is the name of the POST res.body variable (but is never stored in the database!)
const UserSchema = new mongoose.Schema({
  email: { type: String },
  verified: { type: Boolean },
  name: { type: String },
  password: { type: String },
  hash: { type: String },
  session: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
