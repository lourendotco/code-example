const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blog_id: { index: true, type: mongoose.Schema.Types.ObjectID, ref: "Blog" },
  text: String,
});

commentSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.blog_id;
  },
});

module.exports = mongoose.model("Comment", commentSchema);
