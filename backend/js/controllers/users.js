const bcrypt = require("bcrypt");
const usersR = require("express").Router();
const User = require("../models/user");

usersR.post("/", async (req, res, next) => {
  const { username, password, name } = req.body;

  if ((username.length < 3) | (password.length < 3)) {
    return res.status(400).send({ error: "username or password too short" });
  }

  const saltR = 10;
  const passHash = await bcrypt.hash(password, saltR);
  try {
    const savedUser = await new User({
      username,
      name,
      passHash,
    }).save();
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ error: "username exists" });
    }
    next(err);
  }
});

usersR.get("/", async (req, res) => {
  res.json(
    await User.find({}).populate("blogs", "url createdAt id title author -user")
  );
});

module.exports = usersR;
