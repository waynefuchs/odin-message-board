import type { NextApiRequest, NextApiResponse } from "next";
const status = require("http-status");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(status.OK).json({ message: "It works" });
}
