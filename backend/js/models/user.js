const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passHash: {
    type: String,
    required: true,
  },
});

userSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "user",
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.passHash;
  },
});

module.exports = mongoose.model("User", userSchema);
