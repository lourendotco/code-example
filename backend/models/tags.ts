import mongoose from 'mongoose';

interface Tag {
    blog_id: mongoose.Types.ObjectId;
    tag: string;
    tag_low: string;
}

const tagSchema = new mongoose.Schema({
    blog_id: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", index: true },
    tag: String,
    tag_low: {
      type: String,
      default: function (this: Tag) {
        return this.tag?.toLowerCase();
      },
      index: true,
    },
  });
  
export default mongoose.model("Tags", tagSchema);
  