import { like, login, newBlog, newUser } from "../types";

export const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isLong = (text:unknown): string => {
    if (!isString(text) || !(text.length >= 3) ) {
        throw new Error('username or password too short');
    }
    return text;
};

const isTitle = (text:unknown): string => {
    if (!isString(text)) {
        throw new Error('incorrect format');
    }
    return text;
};

const isUrl = (text:unknown): string => {
    if (!isString(text)) {
        throw new Error('incorrect format');
    }
    try {
        let urlParse = text;
        if ( !urlParse.startsWith('http://') || !urlParse.startsWith('https://') ) {
            urlParse = 'https://' + urlParse
        }
        const urlObject = new URL(urlParse);
        return urlObject.href;
    } catch (e) {
        throw new Error ('url not recognized');
    }
};

export const isTags = (object: unknown): string[] => {
    if (!Array.isArray(object) || !(object.length > 0) || !object.every(isString)) {
        return [];
    }
    return object;
};

export const isComment = (text:unknown): string => {
    if (!isString(text)) {
        throw new Error('malformatted comment');
    }
    return text;
};

const isNumber = (vote: unknown): vote is number => {
    return !isNaN(Number(vote));
};

const isVote = (vote:number): vote is like['vote'] => {
    if ([0, 1, -1].includes(vote)) {
        return true;
    } else return false;
};

export const likeCheck = (object: unknown): like => {
    if (!object || typeof object !== 'object' ) {
        throw new Error('invalid vote');
    }
    if ('vote' in object && isNumber(object.vote) && isVote(object.vote)) {
        return {
            vote: object.vote
        };
    }
    throw new Error('nice try');
};

export const newUserCheck = (object: unknown): newUser => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect format!');
    } if ('username' in object && 'password' in object) {
        if ('name' in object) return {
            username: isLong(object.username),
            password: isLong(object.password),
            name: isLong(object.name), 
        };
        return {
            username: isLong(object.username),
            password: isLong(object.password)
        };
    }
    throw new Error('missing username or password');
};

export const loginCheck = (object: unknown): login => {
    if (!object || typeof object !== 'object') {
        throw new Error('unauthorized');
    }
    if ('username' in object && 'password' in object) {
        return {
            username: isLong(object.username),
            password: isLong(object.password)
        };
    }
    throw new Error('unauthorized');
};

export const newBlogCheck = (object: unknown): newBlog => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect format!');
    }
    const newBlogObject:newBlog = { title: '', url: '' };
    if ('title' in object && 'url' in object && 'tags' in object) {
        newBlogObject.title = isTitle(object.title);
        newBlogObject.url = isUrl(object.url);
        newBlogObject.tags = isTags(object.tags);
    }
    return newBlogObject;
};