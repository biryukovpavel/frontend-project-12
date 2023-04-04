import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NotFoundPage from './NotFoundPage';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='' element={<MainPage />} />
        <Route path='login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
