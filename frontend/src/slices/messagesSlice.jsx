import { createSlice } from "@reduxjs/toolkit";
import { setInitialState } from "./channelsSlice";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, { payload }) => {
      const { messages } = payload;
      state.messages = messages;
    });
  },
});


export default messagesSlice.reducer;
