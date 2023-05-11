import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import userReducer, { login } from "./reducers/userReducer";

const user = () => {
  try {
    return JSON.parse(window.localStorage.getItem("loggedUser"));
  } catch (e) {
    return null;
  }
};

const preloadedState = { notifications: [], blogs: [], user: user() };

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
  preloadedState,
});

export default store;
