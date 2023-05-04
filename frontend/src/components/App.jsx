import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import React, { useState } from 'react';
import AuthContext from '../contexts/index.jsx';
import useAuth from "../hooks/index.jsx";

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [loggedIn, setLoggedIn] = useState(currentUser ? true : false);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };
  const getAuthHeader = () => {
    const { token } = currentUser || {};
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const UnprivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? <Navigate to="/" state={{ from: location }} /> : children
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          <Routes>
            <Route path='*' element={<NotFoundPage />} />
            <Route
              path='/'
              element={(
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              )}
            />
            <Route
              path='login'
              element={(
                <UnprivateRoute>
                  <LoginPage />
                </UnprivateRoute>
              )}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
