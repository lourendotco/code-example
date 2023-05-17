const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
// const cors = require("cors");
const blogsR = require("./controllers/blogs");
const usersR = require("./controllers/users");
const loginR = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require('path')

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) =>
    logger.error("error connecting to MongoDB:", error.message)
  );

// app.use(cors());
app.use(express.static('dist'))
app.use(express.json());
app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

app.use("/api/blogs", middleware.userExtractor, blogsR);
app.use("/api/users", usersR);
app.use("/api/login", loginR);
app.get('*', function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, 'dist/')});
});

if (process.env.NODE_ENV === "test") {
  const testing = require("./controllers/testing");
  app.use("/api/testing", testing);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
