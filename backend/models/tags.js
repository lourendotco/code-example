const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  blog_id: { type: mongoose.Schema.Types.ObjectID, ref: "Blog", index: true },
  tag: String,
  tag_low: {
    type: String,
    default: function () {
      return this.tag?.toLowerCase();
    },
    index: true,
  },
});

module.exports = mongoose.model("Tags", tagSchema);
