import Like from "./Like";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Blog = ({ id }) => {
  const blog = useSelector((state) => state.blogs.find((b) => b._id === id));
  const timestamp =
    new Date(blog.createdAt).toLocaleDateString("en-gb", {
      month: "long",
      year: "numeric",
      day: "numeric",
    }) +
    " at " +
    blog.createdAt.split("T")[1].slice(0, 5);
  return (
    <div className="mb-5 font-light">
      <div className="w-[100%] flex">
        <Link to={blog._id}>
          {blog.title} by {blog.author}
        </Link>
        <Like
          blog_id={blog._id}
          bloglikes={blog.likes}
          isLiked={blog.isLiked[0]?.vote}
        />
      </div>
      <div>
        added by{" "}
        <Link to={`/users/${blog.user[0]._id}`}>
          {blog.user[0].name || blog.user[0].username}
        </Link>
      </div>
    </div>
  );
};

// defining target="_blank" prevents the javascript from acting on the page, and chrome blocks it
// another way would be to establish a inbetween page, you're being led to a website outside this domain, are you sure
// you want to proceed. this inbetween page would be in a different domain with no access to sensitive cookies.
export default Blog;
