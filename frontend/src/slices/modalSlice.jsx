/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  isShow: false,
  channelId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal(state, { payload }) {
      const { type, channelId } = payload;
      state.isShow = true;
      state.type = type;
      state.channelId = channelId;
    },
    closeModal(state) {
      state.isShow = false;
      state.type = null;
      state.channelId = null;
    },
  },
});

export const { showModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
