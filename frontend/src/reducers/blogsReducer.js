import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { timedNotifications } from "./notificationReducer";
import axios from "axios";
import { logout } from "./userReducer";

const baseUrl = "/api/blogs";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (content, thunkApi) => {
    const state = await thunkApi.getState();
    const token = `Bearer ${state.user.userToken}`;
    try {
      const request = await axios.get(baseUrl, {
        headers: { Authorization: token },
      });
      return request.data;
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({
          success: false,
          message: e.response.data.error || "no internet",
        })
      );
      throw new Error("failed");
    }
  }
);

export const fetchComments = createAsyncThunk(
  "blogs/fetchComments",
  async (content, thunkApi) => {
    try {
      const request = await axios.get(`${baseUrl}/comments/${content}`);
      return { id: content, data: request.data };
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({
          success: false,
          message: e.response.data.error || "no internet",
        })
      );
      throw new Error("failed");
    }
  }
);

export const addComment = createAsyncThunk(
  "blogs/addComment",
  async (content, thunkApi) => {
    try {
      const comment = await axios.post(
        `${baseUrl}/comment/${content.id}`,
        content
      );
      return { id: content.id, data: comment.data };
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({
          success: false,
          message: e.response.data.error || "error connecting to the server",
        })
      );
      throw new Error("failed");
    }
  }
);

export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (content, thunkApi) => {
    const state = await thunkApi.getState();
    const token = `Bearer ${state.user.userToken}`;
    try {
      const blog = await axios.post(baseUrl, content, {
        headers: { Authorization: token },
      });
      thunkApi.dispatch(
        timedNotifications({
          success: true,
          message: "saved " + blog.data.title,
        })
      );
      return blog.data;
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({
          success: false,
          message: e.response.data.error || "error connecting to the server",
        })
      );
      throw new Error("failed");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (content, thunkApi) => {
    const state = await thunkApi.getState();
    const token = `Bearer ${state.user.userToken}`;
    try {
      await axios.delete(`${baseUrl}/${content._id}`, {
        headers: { Authorization: token },
      });
      thunkApi.dispatch(
        timedNotifications({
          success: true,
          message: `deleted ${content.title}`,
        })
      );
      return content._id;
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({
          success: false,
          message: e.response.data.error || "error connecting to the server",
        })
      );
      throw new Error("failed");
    }
  }
);

export const likeBlog = createAsyncThunk(
  "blogs/likeBlog",
  async ({ blog_id, vote }, thunkApi) => {
    const state = await thunkApi.getState();
    const token = `Bearer ${state.user.userToken}`;
    try {
      await axios.put(
        `${baseUrl}/like/${blog_id}`,
        { vote },
        { headers: { Authorization: token } }
      );
      return { blog_id, vote };
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({
          success: false,
          message: e.response.data.error || "no internet",
        })
      );
      throw new Error("failed");
    }
  }
);

const blogs = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    newBlog: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(deleteBlog.fulfilled, (state, action) =>
        state.filter((b) => b._id !== action.payload)
      )
      .addCase(likeBlog.fulfilled, (state, action) => {
        const index = state.findIndex((b) => b._id === action.payload.blog_id);
        if (!action.payload.vote) {
          if (state[index].isLiked[0]?.vote > 0) {
            state[index].likes -= 1;
          }
          if (state[index].isLiked[0]?.vote < 1) {
            state[index].likes += 1;
          }
        } else {
          state[index].likes += action.payload.vote;
        }
        state[index].isLiked[0]
          ? (state[index].isLiked[0].vote = action.payload.vote)
          : (state[index].isLiked[0] = { vote: action.payload.vote });
      })
      .addCase(logout.fulfilled, (state) => [])
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.findIndex((b) => b._id === action.payload.id);
        state[index].comments
          ? state[index].comments.push(action.payload.data)
          : (state[index].comments = [action.payload.data]);
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const index = state.findIndex((b) => b._id === action.payload.id);
        state[index].comments = action.payload.data;
      });
  },
});

export default blogs.reducer;
