import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface authReq extends Request {
    user?: JwtPayload | string | JwtPayload & { id: string }
}


export interface newUser {
    username: string;
    password: string;
    name?: string;
}

export interface ExtendedError extends Error {
    code?: number;
}

export interface newBlog {
    title: string;
    url: string;
    author?: string[];
    tags?: string[];
}

export interface login {
    username: string;
    password: string;
}

export interface like {
    vote:  0 | 1 | -1;
}