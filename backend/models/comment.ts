import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    blog_id: { index: true, type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    text: String,
  });
  
  commentSchema.set("toJSON", {
    transform: (_doc, ret) => {
      delete ret.__v;
      delete ret.blog_id;
    },
  });
  
export default mongoose.model("Comment", commentSchema);