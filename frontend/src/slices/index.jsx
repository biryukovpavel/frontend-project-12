import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from './channelsSlice.jsx';
import messagesReducer  from "./messagesSlice.jsx";
import modalReducer from "./modalSlice.jsx";

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
  },
});
