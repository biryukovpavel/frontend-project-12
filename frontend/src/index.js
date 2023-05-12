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

const socket = io();

socket.on('newMessage', (message) => {
  store.dispatch(addMessage({ message }));
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

  return (
    <ApiContext.Provider value={{ sendMessage }}>
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
    </Provider>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
