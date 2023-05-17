import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express, { RequestHandler } from 'express';
const loginR = express.Router();
import User from '../models/user';
import { loginCheck } from '../utils/reqCheck';


loginR.post("/", (async (req, res) => {
  const { username, password } = loginCheck(req.body);

  const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }
  const correct = user
    ? await bcrypt.compare(password, user.passHash)
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
    process.env.SECRET as string,
    { expiresIn: 60 * 60 }
  );
  return res.status(200).send({ userToken, username: user.username, name: user.name });
}) as RequestHandler);

export default loginR;