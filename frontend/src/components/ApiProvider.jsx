import React from 'react';
import { ApiContext } from 'contexts/index.jsx';

const ApiProvider = ({ socket, children }) => {
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
    <ApiContext.Provider value={{
      sendMessage, addChannel, removeChannel, renameChannel,
    }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
