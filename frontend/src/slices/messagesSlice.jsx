import { createSlice } from "@reduxjs/toolkit";
import { removeChannel, setInitialState } from "./channelsSlice";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, { payload }) {
      const { message } = payload;
      state.messages.push(message);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, { payload }) => {
      const { messages } = payload;
      state.messages = messages;
    });
    builder.addCase(removeChannel, (state, { payload }) => {
      const { channelId } = payload;
      state.messages = state.messages.filter((message) => message.channelId !== channelId);
    });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
