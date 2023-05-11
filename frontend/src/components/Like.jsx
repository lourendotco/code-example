import { useDispatch } from "react-redux";
import { likeBlog } from "../reducers/blogsReducer";

export default function Like({ blog_id, bloglikes, isLiked }) {
  const dispatch = useDispatch();
  const vote = (vote) => {
    dispatch(likeBlog({ blog_id, vote }));
  };
  const upvote = () => {
    let onClick;
    let className;
    if (isLiked === 1) {
      className = "p-2 border rounded-full bg-gray-100";
      onClick = null;
    } else {
      onClick = () => vote(isLiked === -1 ? 0 : 1);
      className = "p-2 border rounded-full hover:bg-gray-100";
    }

    return (
      <button onClick={onClick} className={className} name="upvote">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    );
  };

  const downvote = () => {
    let onClick;
    let className;
    if (isLiked === -1) {
      className = "p-2 border rounded-full bg-gray-100";
      onClick = null;
    } else {
      onClick = () => vote(isLiked === 1 ? 0 : -1);
      className = "p-2 border rounded-full hover:bg-gray-100";
    }

    return (
      <button onClick={onClick} className={className} name="downvote">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className="flex items-center space-x-4 mr-0 ml-auto" id="likes">
      {downvote()}
      <span className="text-2m font-semibold">{bloglikes}</span>
      {upvote()}
    </div>
  );
}
