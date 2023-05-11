const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  blog_id: { index: true, type: mongoose.Schema.Types.ObjectID, ref: "Blog" },
  user_id: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
  vote: Number,
});

module.exports = mongoose.model("Likes", likesSchema);
