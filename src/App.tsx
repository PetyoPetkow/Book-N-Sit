import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserAccountPage from './pages/users/UserAccountPage';
import Header from './navigation/Header';
import Places from './pages/places/Places';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const App = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        {/* <Route path="/" element={<Places />} /> */}
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/" element={<RegisterPage />} /> */}
        <Route path="/account" element={<UserAccountPage />} />
      </Routes>
    </div>
  );
};

export default App;
