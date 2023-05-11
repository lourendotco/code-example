import { useState } from "react";
import TagI from "./TagsI";
import { timedNotifications } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { addBlog } from "../reducers/blogsReducer";

export default function Compose({ setVisible }) {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    tags: "",
  });
  const dispatch = useDispatch();
  const submit = async (e) => {
    e.preventDefault();
    if ((newBlog.title.length < 1) | (newBlog.url.length < 3)) {
      return dispatch(
        timedNotifications({
          success: false,
          message: "blogs need a title and an url",
        })
      );
    }
    // // // const timestamp = new Date()
    // // // setterB([...blogs, {...newBlog, id:"temporary", createdAt: timestamp.toISOString(), likes: 0, dislikes: 0 }])
    const success = await dispatch(addBlog(newBlog));
    if (success.type === "blogs/addBlog/fulfilled") {
      setNewBlog({ title: "", author: "", url: "", tags: "" });
      setVisible(false);
    }
    // if (res.success === false) {
    //   logout(setterU)
    //   return dispatch(timedNotifications(res)) // does this work?
    // }
  };

  const composeBlog = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form className="flex flex-wrap" onSubmit={submit}>
        <input
          className="placeholder-lime-700 border-green-700 border p-1 rounded-md my-1 ml-1 mr-0.5 w-1/2 text-lime-900 outline-0 "
          type="text"
          placeholder="title"
          onChange={composeBlog}
          value={newBlog.title}
          name="title"
        />
        <input
          className="placeholder-lime-700 border-green-700 border p-1 rounded-md my-1 ml-0.5 w-1/3 text-lime-900 outline-0"
          type="text"
          placeholder="author"
          onChange={composeBlog}
          value={newBlog.author}
          name="author"
        />
        <input
          className="placeholder-lime-700 border-green-700 border p-1 rounded-md m-1 w-4/5 text-lime-900 outline-0"
          type="text"
          placeholder="url"
          onChange={composeBlog}
          value={newBlog.url}
          name="url"
        />
        <TagI NB={newBlog} setterNB={setNewBlog} />
        <button
          className="px-4 py-2 font-bold text-sm bg-lime-200 text-lime-900 rounded-md	 shadow-sm m-1"
          type="submit"
        >
          add!
        </button>
      </form>
    </div>
  );
}
