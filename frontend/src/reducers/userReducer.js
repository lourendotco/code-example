import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { timedNotifications } from "./notificationReducer";

export const login = createAsyncThunk(
  "user/login",
  async (content, thunkApi) => {
    try {
      const res = await axios.post("/api/login", content);
      window.localStorage.setItem("loggedUser", JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      thunkApi.dispatch(
        timedNotifications({ success: false, message: e.response.data.error })
      );
      throw new Error("failed");
    }
  }
);
export const logout = createAsyncThunk("user/logout", async () => {
  window.localStorage.removeItem("loggedUser");
  return;
});

const user = createSlice({
  name: "user",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => action.payload)
      .addCase(logout.fulfilled, () => null);
  },
});

export default user.reducer;
