const mongoose = require("mongoose");
const Likes = require("./likes");
const Tags = require("./tags");
const Comment = require("./comment");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectID, ref: "User" }],
  },
  { timestamps: true }
);

blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
  },
});

blogSchema.pre("deleteOne", { document: true }, async function (next) {
  await Likes.deleteMany({ blog_id: this.id });
  await Tags.deleteMany({ blog_id: this.id });
  await Comment.deleteMany({ blog_id: this.id });
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
