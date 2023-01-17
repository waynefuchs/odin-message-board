import bcrypt from "bcrypt";
import mongoose from "mongoose";

// `password` is the name of the POST res.body variable (but is never stored in the database!)
const UserSchema = new mongoose.Schema({
  email: { type: String },
  verified: { type: Boolean },
  name: { type: String },
  password: { type: String },
  hash: { type: String },
  session: { type: String },
  admin: { type: Boolean },
});

// AuthorSchema.virtual("name").get(function () {
//   return [this.family_name.trim(), this.first_name.trim()]
//     .filter((v) => v)
//     .join(", ");
// });
// ProjectSchema.statics.byName = function(name) {
//   return this.find({ name: name });
// };

UserSchema.statics.byEmail = async function (email) {
  const user = await this.find({ email });
  return user.length === 1 ? user : false;
};

// UserSchema.virtual("getByEmail").get(async function (email) {
//   const user = await this.find({ email });
//   return user.length === 1 ? user : false;
// });

async function getById(id) {
  const user = await this.find({ id });
  return user.length === 1 ? user : false;
}

async function getByName(name) {
  const user = await this.find({ name });
  return user.length === 1 ? user : false;
}

// Helper function, generates bcrypt hash
async function getPasswordHash(password) {
  return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
}

/**
 * Check if email and password credentials are valid
 * @param {string} email Email in plain text
 * @param {string} password Password in plain text
 * @returns User object if credentials are valid, false if invalid.
 */
UserSchema.statics.verifyUserCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }, { password: 0 });
    if (await bcrypt.compare(password, user.hash)) return user;
  } catch (error) {
    throw new Error(`Password comparison failed: ${error}`);
  }
  return false;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
