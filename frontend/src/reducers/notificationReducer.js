import { createSlice } from "@reduxjs/toolkit";

const getId = () => (1000 * Math.random()).toFixed(0);
const notifications = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNew: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: ({ message, success, error }) => {
        if (!message)
          return { payload: { id: getId(), message: error, success } };
        return { payload: { id: getId(), message, success } };
      },
    },
    clear: (state) => {
      state.shift();
    },
  },
});

export const timedNotifications = (content) => {
  return (dispatch) => {
    dispatch(addNew(content));
    setTimeout(() => dispatch(clear()), 4000);
  };
};

export const { addNew, clear } = notifications.actions;
export default notifications.reducer;
