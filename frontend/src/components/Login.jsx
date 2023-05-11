import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/userReducer";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const credentials = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginO = await dispatch(login(loginForm));
      setLoginForm({ username: "", password: "" });
      navigate("/blogs");
    } catch (ex) {
      return;
    }
  };

  return (
    <div>
      <form className="font-light text-right" onSubmit={submit}>
        <input
          className="mr-0 ml-auto bg-lime-50 text-lime-900 placeholder-lime-700"
          type="text"
          placeholder="username"
          value={loginForm.username}
          onChange={credentials}
          name="username"
        />
        <br />
        <input
          className="mr-0 ml-auto bg-lime-50 text-lime-900 placeholder-lime-700"
          type="password"
          placeholder="password"
          value={loginForm.password}
          onChange={credentials}
          name="password"
        />
        <br />
        <button
          className="flex mr-0 ml-auto px-4 py-2 text-sm bg-lime-200 text-lime-900 rounded-md shadow-sm"
          name="login"
        >
          login
        </button>
      </form>
    </div>
  );
}
