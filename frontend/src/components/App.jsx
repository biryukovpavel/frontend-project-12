import {
  BrowserRouter, Link, Navigate, Route, Routes, useLocation,
} from 'react-router-dom';

import React, { useState } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import NotFoundPage from './NotFoundPage';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';
import { AuthContext } from '../contexts/index.jsx';
import { useAuth } from '../hooks/index.jsx';
import SignupPage from './SignupPage';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [loggedIn, setLoggedIn] = useState(!!currentUser);

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
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, getAuthHeader, currentUser,
    }}
    >
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

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    auth.loggedIn && <Button onClick={auth.logOut}>{t('logout')}</Button>
  );
};

const App = () => {
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to="/">{t('headerText')}</Navbar.Brand>
              <AuthButton />
            </Container>
          </Navbar>

          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path="/"
              element={(
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              )}
            />
            <Route
              path="login"
              element={(
                <UnprivateRoute>
                  <LoginPage />
                </UnprivateRoute>
              )}
            />
            <Route
              path="signup"
              element={(
                <UnprivateRoute>
                  <SignupPage />
                </UnprivateRoute>
              )}
            />
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
