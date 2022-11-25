import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  posted: {
    type: Date,
  },
})

export default mongoose.models.Post || mongoose.model('Post', PostSchema)