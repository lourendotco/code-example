import mongoose from 'mongoose';

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
  transform: (_doc, ret) => {
    delete ret.__v;
    delete ret.passHash;
  },
});

//schema.pre('deleteOne');


export default mongoose.model("User", userSchema);