import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  deleteBlog,
  addComment,
  fetchComments,
} from "../reducers/blogsReducer";
import Like from "./Like";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function () {
  const { id } = useParams();
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const blog = useSelector((state) => state.blogs.find((b) => b._id === id));
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchComments(id));
  }, [id]);
  if (!blog) {
    dispatch(fetchBlogs());
    return;
  }
  const handle = (e) => {
    if (e.key === "Enter") {
      submit()
    }
  };
  const submit = () => {
    if (text.length === 0) {
      return;
    }
    dispatch(addComment({ id, text }));
    setText("");
  };
  const deleteAndDisappear = () => {
    navigate(-1);
    dispatch(deleteBlog({ title: blog.title, _id: blog._id }));
  };
  const timestamp =
    new Date(blog.createdAt).toLocaleDateString("en-gb", {
      month: "long",
      year: "numeric",
      day: "numeric",
    }) +
    " at " +
    blog.createdAt.split("T")[1].slice(0, 5);
  return (
    <div className=" text-lime-900 font-light">
      <div className="flex">
        {blog.title}
        <br />
        by {blog.author}
        <div className="mr-0 ml-auto">
          <Like
            blog_id={blog._id}
            bloglikes={blog.likes}
            isLiked={blog.isLiked[0]?.vote}
          />
        </div>
      </div>
      <div className="flex flex-wrap m-1 items-center gap-1">
        {blog.tags.map((t, i) => (
          <span
            key={t.tag + i}
            className="bg-lime-100 inline-block py-0.5 px-1 rounded-md"
          >
            {t.tag}
          </span>
        ))}
      </div>
      <div className="font-extralight">
        <a href={blog.url} target="_blank" rel="noreferrer">
          open link
        </a>
      </div>
      <div className="font-extralight flex">
        <div className="ml-0">
          added by{" "}
          <Link to={`/users/${blog.user[0]._id}`}>
            {blog.user[0].name || blog.user[0].username}
          </Link>{" "}
          on {timestamp}
        </div>
        {user?.username === blog.user[0]?.username && (
          <div className="text-right mr-3 ml-auto">
            <button
              className="px-4 py-2 text-sm bg-lime-200 text-lime-900 rounded-md shadow-sm"
              onClick={deleteAndDisappear}
            >
              delete
            </button>
          </div>
        )}
      </div>
      {blog.comments?.length > 0 && (
        <div className="mr-3 mt-5">
          <div className="block text-right font-medium">comments:</div>
          {blog.comments?.map((c) => (
            <div key={c._id} className="block text-right">
              {c.text}
            </div>
          ))}
        </div>
      )}
      <div className="my-5 flex mr-3 space-x-2">
        <input
          className="mr-0 ml-auto bg-lime-50 text-lime-900 placeholder-lime-700"
          type="text"
          placeholder="add a comment!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handle}
          name="new comment"
        />
        <br />
        <button
          className="px-4 py-2 text-sm bg-lime-200 text-lime-900 rounded-md shadow-sm"
          name="submit"
          onClick={submit}
        >
          add!
        </button>
      </div>
    </div>
  );
}
