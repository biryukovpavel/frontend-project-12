import { configureStore } from "@reduxjs/toolkit";
import channelsReducer from './channelsSlice.jsx';
import messagesReducer  from "./messagesSlice.jsx";

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
});
