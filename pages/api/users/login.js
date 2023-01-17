import dbConnect from "../../../lib/db/dbConnect";
import User from "../../../models/User";

import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await dbConnect();
  switch (req.method) {
    case "POST":
      try {
        const user = await User.verifyUserCredentials(
          req.body.email,
          req.body.password
        );
        if (!user) throw new Error("Authentication failed");
        const tokenData = {
          id: user._id,
        };

        // This is the token used to grant access
        const accessToken = jwt.sign(
          tokenData,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: Number(process.env.TOKEN_EXPIRES_IN_SECONDS) }
        );

        const refreshToken = jwt.sign(
          tokenData,
          process.env.REFRESH_TOKEN_SECRET
        );

        res.status(200).json({ success: true, user, accessToken: accessToken });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not supported" });
      break;
  }
}
