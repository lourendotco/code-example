import Blog from "./Blog";
import { useState, useEffect } from "react";
import Toggable from "./Toggable";
import Compose from "./Compose";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../reducers/blogsReducer";

export default function Blogs() {
  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [user]);
  const [order, setOrder] = useState(false);
  const dispatch = useDispatch();
  const blogs = useSelector((state) =>
    state.blogs.map((blog) => {
      return { _id: blog._id, likes: blog.likes, createdAt: blog.createdAt };
    })
  );
  const blogOrder = order
    ? blogs.toSorted((a, b) =>
        b.likes < a.likes ? -1 : b.likes > a.likes ? 1 : 0
      )
    : blogs.toSorted((a, b) =>
        a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0
      );

  return (
    <div className="text-lime-900">
      <Toggable action="compose blog">
        <Compose />
      </Toggable>
      <div className="flex my-5">
        <h3 className="text-lime-900 font-bold">blogs</h3>
        <div className="mr-0 ml-auto">
          <button onClick={() => setOrder(!order)}>
            sort by {order ? "date" : "likes"}
          </button>
        </div>
      </div>
      {blogOrder.map((blog) => {
        return <Blog key={blog._id} id={blog._id} />;
      })}
    </div>
  );
}
