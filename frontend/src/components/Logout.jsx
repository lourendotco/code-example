import { useDispatch } from "react-redux";
import { logout } from "../reducers/userReducer";
import { useNavigate } from "react-router-dom";

export default function Logout({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function log_out() {
    dispatch(logout());
    navigate("/");
  }
  return (
    <div className="flex text-sm">
      <h2 className="mr-0 ml-auto">
        {user.name ? user.name : user.username}{" "}
        <button
          className="px-4 py-2 bg-lime-200 text-lime-900 rounded-md shadow-sm"
          onClick={log_out}
        >
          {"not " + (user.name ? user.name : user.username) + "?"}
        </button>
      </h2>
    </div>
  );
}
