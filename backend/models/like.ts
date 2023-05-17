import mongoose from 'mongoose';

const likesSchema = new mongoose.Schema({
    blog_id: { index: true, type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vote: Number,
  });
  
export default mongoose.model("Likes", likesSchema);