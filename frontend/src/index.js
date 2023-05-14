import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './slices/index.jsx';

import './assets/application.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { io } from 'socket.io-client';
import { addMessage } from 'slices/messagesSlice.jsx';
import { ApiContext } from 'contexts/index.jsx';
import { addChannel, removeChannel, renameChannel } from 'slices/channelsSlice.jsx';

const socket = io();

socket.on('newMessage', (message) => {
  store.dispatch(addMessage({ message }));
});

socket.on('newChannel', (channel) => {
  store.dispatch(addChannel({ channel }));
});

socket.on('removeChannel', ({ id }) => {
  store.dispatch(removeChannel({ channelId: id }));
});

socket.on('renameChannel', (channel) => {
  store.dispatch(renameChannel({ channel }));
});

const ApiProvider = ({ children }) => {
  const sendMessage = (message) => new Promise((resolve, reject) => {
    socket.timeout(5000).emit('newMessage', message, (error, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      }

      reject(error);
    });
  });

  const addChannel = (channel) => new Promise((resolve, reject) => {
    socket.timeout(5000).emit('newChannel', channel, (error, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      }

      reject(error);
    });
  });

  const removeChannel = (channelId) => new Promise((resolve, reject) => {
    socket.timeout(5000).emit('removeChannel', { id: channelId }, (error, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      }

      reject(error);
    });
  });

  const renameChannel = (channel) => new Promise((resolve, reject) => {
    socket.timeout(5000).emit('renameChannel', channel, (error, response) => {
      if (response?.status === 'ok') {
        resolve(response);
      }

      reject(error);
    });
  });

  return (
    <ApiContext.Provider value={{ sendMessage, addChannel, removeChannel, renameChannel }}>
      {children}
    </ApiContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApiProvider>
        <App />
      </ApiProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
