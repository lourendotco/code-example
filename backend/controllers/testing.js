const testing = require("express").Router();
const Blog = require("../models/blog");
const Likes = require("../models/likes");
const Tags = require("../models/tags");
const User = require("../models/user");

testing.post("/reset", async (req, res) => {
  await Blog.deleteMany({});
  await Likes.deleteMany({});
  await Tags.deleteMany({});
  res.status(204).end();
});

testing.post("/reset/user", async (req, res) => {
  await User.deleteMany({});
  res.status(204).end();
});

module.exports = testing;
