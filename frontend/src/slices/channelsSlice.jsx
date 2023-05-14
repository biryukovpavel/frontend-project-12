import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  currentChannelId: null,
};

const defaultChannelId = 1;

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState(state, { payload }) {
      const { channels, currentChannelId } = payload;
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
    setCurrentChannel(state, { payload }) {
      const { channelId } = payload;
      state.currentChannelId = channelId;
    },
    addChannel(state, { payload }) {
      const { channel } = payload;
      state.channels.push(channel);
    },
    removeChannel(state, { payload }) {
      const { channelId } = payload;
      state.channels = state.channels.filter(({ id }) => id !== channelId);
      if (state.currentChannelId === channelId) {
        state.currentChannelId = defaultChannelId;
      }
    },
    renameChannel(state, { payload }) {
      const { channel } = payload;
      const currentChannel = state.channels.find(({ id }) => id === channel.id);
      currentChannel.name = channel.name;
    },
  },
});

export const { setInitialState, setCurrentChannel, addChannel, removeChannel, renameChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
