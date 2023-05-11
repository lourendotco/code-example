const totalLikes = (blogs) => {
  return blogs.reduce((sum, post) => sum + post.likes, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  return blogs.reduce(
    (cand, cur) => {
      if (cur.likes > cand.likes) {
        return cur;
      }
      return cand;
    },
    { likes: 0 }
  );
};

const mostBlogs = (blogs) => {
  const posts = blogs.reduce((acc, cur) => {
    acc[cur.author] = acc[cur.author] + 1 || 1;
    return acc;
  }, {});
  return Object.entries(posts).reduce(
    (cand, cur) => {
      if (cur[1] > cand[1]) {
        return cur;
      }
      return cand;
    },
    [0, 0]
  );
};

const mostLikes = (blogs) => {
  const posts = blogs.reduce((acc, cur) => {
    acc[cur.author] = acc[cur.author] || 0;
    acc[cur.author] += cur.likes;
    return acc;
  }, {});
  return Object.entries(posts).reduce(
    (cand, cur) => {
      if (cur[1] > cand[1]) {
        return cur;
      }
      return cand;
    },
    [0, 0]
  );
};

module.exports = {
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
