import logger from './logger';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { authReq } from '../types';

const errorHandler = (er:Error, _req:Request, res:Response, next:NextFunction ): void => {
    logger.error(er.message);
    if (er.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' });
    } else if (er.name === 'ValidationError') {
        res.status(400).send({ error: er.message });
    } else {
        next(er);
    }
};

const unknownEP = (_req:Request, res:Response) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const userExtract = (req:authReq, res:Response, next:NextFunction) => {
    req.user = {};
        try {
            const auth = req.get('authorization');
            if (auth?.startsWith('Bearer ')) {
                req.user = jwt.verify(
                    auth.replace('Bearer ', ''),
                    process.env.SECRET as string
             );
            }
        } catch (e) {
            if (e instanceof Error) {
                if (e.name === 'JsonWebTokenError') {
                    return res.status(401).send({ error: e.message });
                } else if (e.name === 'TokenExpiredError') {
                    return res.status(401).send({ error: 'Session expired' });
                }
            }
        }
    next();
    return
};

export default {
    errorHandler,
    unknownEP,
    userExtract
};