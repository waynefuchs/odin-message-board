import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      const { email, name, password } = req.body;
      if (!email) throw new Error("Email is required");
      if (!name) throw new Error("Name is required");
      if (!password) throw new Error("Password is required");
      if (!process.env.SALT_ROUNDS) throw new Error("SALT_ROUNDS not found");

      const verified = false;
      const session = false;
      const saltRounds = Number(process.env.SALT_ROUNDS);

      // Get the hash
      try {
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
          email,
          verified,
          name,
          password,
          hash,
          session,
        });
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
