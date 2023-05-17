import mongoose from 'mongoose';
import Likes from './like';
import Tags from './tags';
import Comment from './comment';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

blogSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
  },
});

blogSchema.post('findOneAndDelete', { document: false, query: true }, async function () {
  const Id = this.getFilter()["_id"] as string;

  await Likes.deleteMany({ blog_id: Id });
  await Tags.deleteMany({ blog_id: Id });
  await Comment.deleteMany({ blog_id: Id });
});

export default mongoose.model("Blog", blogSchema);