export default async function handler(req, res) {
  res.status(200).json({success: true, data: "You did it!"})
}