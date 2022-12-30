import bcrypt from "bcrypt";
import User from "../../models/User";

async function doesUserIdExist(id) {
  const user = await User.find({ id });
  return user.length === 1 ? user : false;
}

async function doesUserNameExist(name) {
  const user = await User.find({ name });
  return user.length === 1 ? user : false;
}

async function getPasswordHash(password) {
  return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
}

/**
 * Check if email and password credentials are valid
 * @param {string} email Email in plain text
 * @param {string} password Password in plain text
 * @returns User object if credentials are valid, false if invalid.
 */
async function verifyUserCredentials(email, password) {
  try {
    const user = await User.findOne({ email }, { password: 0 });
    if (await bcrypt.compare(password, user.hash)) return user;
  } catch (error) {
    throw new Error(`Password comparison failed: ${error}`);
  }
  return false;
}

export default {
  doesUserIdExist,
  doesUserNameExist,
  doesUserEmailExist,
  verifyUserCredentials,
};
