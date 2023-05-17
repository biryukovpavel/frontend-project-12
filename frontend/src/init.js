import { io } from 'socket.io-client';
import React from 'react';
import App from 'components/App.jsx';
import store from './slices/index.jsx';
import { addMessage } from 'slices/messagesSlice.jsx';
import { ApiContext } from 'contexts/index.jsx';
import { addChannel, removeChannel, renameChannel } from 'slices/channelsSlice.jsx';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

const init = async () => {
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

  const i18nInstance = i18next.createInstance();
  await i18nInstance.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    debug: false,
  });

  const ApiProvider = ({ children }) => {
    const sendMessage = (message) =>
      new Promise((resolve, reject) => {
        socket.timeout(5000).emit('newMessage', message, (error, response) => {
          if (response?.status === 'ok') {
            resolve(response);
          }

          reject(error);
        });
      });

    const addChannel = (channel) =>
      new Promise((resolve, reject) => {
        socket.timeout(5000).emit('newChannel', channel, (error, response) => {
          if (response?.status === 'ok') {
            resolve(response);
          }

          reject(error);
        });
      });

    const removeChannel = (channelId) =>
      new Promise((resolve, reject) => {
        socket.timeout(5000).emit('removeChannel', { id: channelId }, (error, response) => {
          if (response?.status === 'ok') {
            resolve(response);
          }

          reject(error);
        });
      });

    const renameChannel = (channel) =>
      new Promise((resolve, reject) => {
        socket.timeout(5000).emit('renameChannel', channel, (error, response) => {
          if (response?.status === 'ok') {
            resolve(response);
          }

          reject(error);
        });
      });

    return <ApiContext.Provider value={{ sendMessage, addChannel, removeChannel, renameChannel }}>{children}</ApiContext.Provider>;
  };

  return (
    <Provider store={store}>
      <ApiProvider>
        <App />
      </ApiProvider>
    </Provider>
  );
};

export default init;
