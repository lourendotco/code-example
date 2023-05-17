import config from './utils/config';
import middleware from './utils/middleware';
import logger from './utils/logger';
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import path from 'path';
require('express-async-errors');
import usersR from './controllers/users';
import blogsR from './controllers/blogs';
import loginR from './controllers/login';
import morgan from 'morgan';
mongoose.set('strictQuery', false);

logger.info('connecting to ', config.MONGODB_URI as string);
mongoose.connect(config.MONGODB_URI as string)
.then(() => {
  logger.info("connected to MongoDB");
})
.catch((e) =>{
    if (e instanceof Error) {
        logger.error('error connecting to MongoDB:', e.message);
    }
});

app.use(express.static('dist'));
app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

app.use('/api/blogs', middleware.userExtract, blogsR);
app.use('/api/users', usersR);
app.use('/api/login', loginR);

app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'dist/')});
});
  

app.use(middleware.unknownEP);
app.use(middleware.errorHandler);

export default app;