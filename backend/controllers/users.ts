import bcrypt from 'bcrypt';
import express, { RequestHandler } from 'express';
const usersR = express.Router();
import User from '../models/user';
import { newUserCheck } from '../utils/reqCheck';
import { ExtendedError } from '../types';



usersR.post("/", (async (req, res, next) => {
  try {
    const checked = newUserCheck(req.body);
    const { username, password, name } = checked;
    
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
      if (!(err instanceof Error)) {
        return next(err);
      }
      const error: ExtendedError = err;
      if (error.code === 11000) {
        res.status(400).send({ error: "username exists" });
      }
      next(err);
    }

  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send({ error: e.message });
    }
    next(e);
  }
}) as RequestHandler);


usersR.get("/", (async (_req, res) => {
    res.json(
     await User.find({}).populate("blogs", "url createdAt id title author -user")
    );
}) as RequestHandler );

export default usersR;
