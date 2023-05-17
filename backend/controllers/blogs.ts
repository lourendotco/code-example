import Blog from '../models/blog';
import Likes from '../models/like';
import Tags from '../models/tags';
import Comment from '../models/comment';
import express, { NextFunction, RequestHandler } from 'express';
import { ObjectId as ObjectID } from 'mongodb';
import { authReq } from '../types';
import { newBlogCheck, isString, isComment, likeCheck } from '../utils/reqCheck';
const blogsR = express.Router();

blogsR.get("/", (async (req:authReq, res) => {
  let query;
  if (!req.user || isString(req.user) || !isString(req.user.id)) {
    query = null;
  } else {
    query = new ObjectID(req.user.id);
  }

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
              cond: { $eq: ["$$like.user_id", query] },
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
}) as RequestHandler);

blogsR.get("/:id", (async (req:authReq, res) => {
  let query;
  if (!req.user || isString(req.user)) {
    query = null;
  } else {
    query = new ObjectID(req.user.id as string);
  }

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
            cond: { $eq: ["$$like.user_id", query] },
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
    res.json(blog);
  } else {
    res.statusMessage = "blog does not exist";
    res.status(404).end();
  }
}) as RequestHandler);

blogsR.post("/", (async (req:authReq, res, next: NextFunction) => {
  if (!req.user || isString(req.user)) {
    return res.status(401).send({ error: "no permission" });
  }
  try {
    const { author, url, title, tags } = newBlogCheck(req.body);
    const blog = new Blog({
      author,
      url,
      title,
      user: [req.user.id],
    });
    const savedBlog = await blog.save();
    const populated = await savedBlog.populate("user");
    const json = populated.toJSON();
    let tagDocs: object[] | undefined;
    if (tags) {
      tagDocs = tags.map((tag) => {
        return { blog_id: savedBlog._id, tag: tag };
      });
      await Tags.insertMany(tagDocs);
    }
  
    const sentblog = { ...json, likes: 0, tags: tagDocs || [], isLiked: [] };
  
    return res.status(201).json(sentblog);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).send({ error: e. message});
    }
    next(e);
  }
  return;
}) as RequestHandler);

blogsR.delete("/:id", (async (req:authReq, res) => {
  if (!req.user || isString(req.user) || !isString(req.user.id)) {
    return res.status(401).send({ error: "no permission" });
  }
  const endangered = await Blog.findOneAndDelete({ _id: req.params.id, user: req.user.id});
  if (!endangered) {
    return res.status(401).send({ error: "unsuccessful" });
  } else {
    return res.status(204).end();
  }
  
}) as RequestHandler);

blogsR.get("/comments/:id", (async (req, res) => {
  res.json(await Comment.find({ blog_id: req.params.id }));
}) as RequestHandler);

blogsR.post("/comment/:id", (async (req, res) => {
  const text = isComment(req.body.text);
  const newComment = new Comment({
    blog_id: req.params.id,
    text,
  });
  res.json(await newComment.save());
}) as RequestHandler);


blogsR.put("/like/:id", (async (req: authReq, res, next) => {

  if (!req.user || isString(req.user) || !isString(req.user.id)) {
    return res.status(401).send({ error: "no permission" });
  }
  const alreadyLiked = await Likes.findOne({
    blog_id: req.params.id,
    user_id: req.user.id,
  });
  try {
    const checked = likeCheck(req.body);
    if (alreadyLiked) {
      if (alreadyLiked.vote === checked.vote) {
        return res.status(200).end();
      } else {
        alreadyLiked.vote = checked.vote;
        return res.json(await alreadyLiked.save());
      }
    }
    const newLike = new Likes({
      blog_id: req.params.id,
      user_id: req.user.id,
      vote: checked.vote,
    });
    return res.json(await newLike.save());
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).send({ error: e.message });
    }
    return next(e);
  }
}) as RequestHandler);

export default blogsR;
