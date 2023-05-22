import { io } from 'socket.io-client';
import React from 'react';
import App from 'components/App.jsx';
import { addMessage } from 'slices/messagesSlice.jsx';
import { addChannel, removeChannel, renameChannel } from 'slices/channelsSlice.jsx';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import ApiProvider from 'components/ApiProvider.jsx';
import resources from './locales/index.js';
import store from './slices/index.jsx';

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

  leoProfanity.add(leoProfanity.getDictionary('fr'));
  leoProfanity.add(leoProfanity.getDictionary('ru'));

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_PUBLIC_ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'development',
      client: {
        javascript: {
          source_map_enabled: true,
        },
      },
    },
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <ApiProvider socket={socket}>
            <App />
          </ApiProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
