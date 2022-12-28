import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
// import bcrypt from "bcrypt";

async function Create(req, res) {
  try {
    const { email, name, password } = req.body;
    if (!email) throw new Error("Email is required");
    if (!name) throw new Error("Name is required");
    if (!password) throw new Error("Password is required");
    if (!process.env.SALT_ROUNDS) throw new Error("SALT_ROUNDS not found");

    const verified = false;
    const session = false;
    const admin = false;
    const saltRounds = Number(process.env.SALT_ROUNDS);

    if (email && (await doesUserEmailExist(email)))
      throw new Error("User email is already in use");
    if (name && (await doesUserNameExist(name)))
      throw new Error("User name already exists");

    // Get the hash
    // const hash = await bcrypt.hash(password, saltRounds);
    const hash = "NOT A REAL HASH";

    const user = await User.create({
      email,
      verified,
      name,
      password,
      hash,
      session,
      admin,
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

async function Read(req, res) {
  try {
    const { id, email, name } = req.body;
    const query = {
      ...(id && { _id: id }),
      ...(email && { email }),
      ...(name && { name }),
    };

    if (Object.keys(query).length > 0) {
      const user = await User.findOne({ query });
      res.status(200).json({ success: true, data: user, single: true });
    } else {
      const users = await User.find({});
      res.status(200).json({ success: true, data: users });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

/////////////////////////////////////////////////
// USER
export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case "POST":
      await Create(req, res);
      break;

    ////////////////////
    // READ
    case "GET":
      await Read(req, res);
      break;

    ////////////////////
    // UPDATE
    case "PUT":
      try {
        // Use email and/or name to search for a
        const { id, email, name } = req.body;
        const user = await User.findOne({ _id: id });
        if (user.length <= 0) throw new Error("User not found");
        if (email && user.email != email) {
          user.email = email;
          user.verified = false;
        }
        if (name && user.name != name) user.name = name;
        await user.save();
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    ////////////////////
    // DELETE
    case "DELETE":
      try {
        const { id } = req.body;
        const user = await User.findOne({ _id: id });
        // TODO: Prevent user from deleting themselves
        await user.remove();
        res.status(200).json({ success: true, data: id });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    ////////////////////
    // ERROR STATE
    default:
      res.status(405).json({ success: false, error: "Method not supported" });
      break;
  }
}

async function doesUserIdExist(id) {
  const user = await User.find({ id });
  return user.length === 1 ? user : false;
}

async function doesUserNameExist(name) {
  const user = await User.find({ name });
  return user.length === 1 ? user : false;
}

async function doesUserEmailExist(email) {
  const user = await User.find({ email });
  return user.length === 1 ? user : false;
}
