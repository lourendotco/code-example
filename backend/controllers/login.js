const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginR = require("express").Router();
const User = require("../models/user");

loginR.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();
  const correct = user
    ? await bcrypt.compare(password, user.passHash) //await?
    : false;
  if (!correct) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }
  const userToken = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  );
  res.status(200).send({ userToken, username: user.username, name: user.name });
});

module.exports = loginR;
