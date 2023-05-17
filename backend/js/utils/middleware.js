const logger = require("./logger");
const jwt = require("jsonwebtoken");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const userExtractor = (req, res, next) => {
  req.user = null;
  try {
    const authorization = req.get("authorization");
    if (authorization?.startsWith("Bearer ")) {
      req.user = jwt.verify(
        authorization.replace("Bearer ", ""),
        process.env.SECRET
      );
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: err.message });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: err.message });
    }
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  userExtractor,
};
