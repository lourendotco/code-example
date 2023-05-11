const blogsR = require("express").Router();
const Blog = require("../models/blog");
const Likes = require("../models/likes");
const Tags = require("../models/tags");
const Comment = require("../models/comment");
const ObjectID = require("mongodb").ObjectId;

blogsR.get("/", async (req, res) => {
  res.json(
    await Blog.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "blog_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "blog_id",
          as: "tags",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      // { $unwind: '$user' },
      {
        $addFields: {
          isLiked: {
            $filter: {
              input: "$likes",
              as: "like",
              cond: { $eq: ["$$like.user_id", new ObjectID(req.user?.id)] },
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          url: 1,
          createdAt: 1,
          user: {
            username: 1,
            name: 1,
            _id: 1,
          },
          likes: {
            $sum: "$likes.vote",
          },
          tags: {
            tag: 1,
          },
          isLiked: {
            vote: 1,
          },
        },
      },
    ])
  );
});

blogsR.get("/:id", async (req, response) => {
  // const blog = await Blog
  //   .findById(request.params.id)
  //   .populate('user')
  const blog = await Blog.aggregate([
    {
      $match: { _id: new ObjectID(req.params.id) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "blog_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "_id",
        foreignField: "blog_id",
        as: "tags",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    // { $unwind: '$user' },
    {
      $addFields: {
        isLiked: {
          $filter: {
            input: "$likes",
            as: "like",
            cond: { $eq: ["$$like.user_id", new ObjectID(req.user?.id)] },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        author: 1,
        url: 1,
        createdAt: 1,
        user: {
          username: 1,
          name: 1,
          _id: 1,
        },
        likes: {
          $sum: "$likes.vote",
        },
        tags: {
          tag: 1,
        },
        isLiked: {
          vote: 1,
        },
      },
    },
  ]);

  if (blog) {
    response.json(blog);
  } else {
    response.statusMessage = "blog does not exist";
    response.status(404).end();
  }
});

blogsR.post("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "no permission" });
  }
  const blog = new Blog({
    author: req.body.author,
    url: req.body.url,
    title: req.body.title,
    user: [req.user.id],
  });
  const savedBlog = await blog.save();
  const populated = await savedBlog.populate("user");
  const json = populated.toJSON();

  if (req.body.tags) {
    var tagDocs = req.body.tags.map((tag) => {
      return { blog_id: savedBlog.id, tag: tag };
    });
    Tags.insertMany(tagDocs);
  }

  const sentblog = { ...json, likes: 0, tags: tagDocs || [], isLiked: [] };

  res.status(201).json(sentblog);
});

blogsR.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "no permission" });
  }
  const endangered = await Blog.findById(req.params.id);
  if (endangered?.user.toString() === req.user.id) {
    await endangered.deleteOne();
    return res.status(204).end();
  }
  return res.status(401).send({ error: "no permission" });
});

blogsR.get("/comments/:id", async (req, res) => {
  res.json(await Comment.find({ blog_id: req.params.id }));
});

blogsR.post("/comment/:id", async (req, res) => {
  const newComment = new Comment({
    blog_id: req.params.id,
    text: req.body.text,
  });
  res.json(await newComment.save());
});

blogsR.put("/like/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "no permission" });
  }
  const alreadyLiked = await Likes.findOne({
    blog_id: req.params.id,
    user_id: req.user.id,
  });
  if (alreadyLiked) {
    if (alreadyLiked.vote === req.body.vote) {
      return res.status(200).end();
    } else {
      alreadyLiked.vote = req.body.vote;
      return res.json(await alreadyLiked.save());
    }
  }

  const newLike = new Likes({
    blog_id: req.params.id,
    user_id: req.user.id,
    vote: req.body.vote,
  });

  res.json(await newLike.save());
  // res.json(await Blog.findByIdAndUpdate(
  //   req.params.id,
  //   { $inc: { likes: 1 } },
  //   { new: true })
  // )
});

// in order to get list of blogs by likes, do a sort on the likes table
// by blog_id which is indexed: https://stackoverflow.com/questions/47724519/how-to-find-most-common-value-for-specific-categories-in-mongodb
// use aggregate to solve the problem of getting likes and dislikes?
// and to get tags also when creating a blog

module.exports = blogsR;
