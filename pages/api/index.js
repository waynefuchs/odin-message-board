import dbConnect from "../../lib/dbConnect"
import Post from "../../models/Post"

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const posts = await Post.find({}) /* find all the data in our database */
        // const subby = await Post.create({message:"Hello World!", posted: new Date()});
        res.status(200).json({ success: true, data: posts })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}