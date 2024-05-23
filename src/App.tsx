import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserAccountPage from './pages/users/UserAccountPage';
import Header from './navigation/Header';
import Places from './pages/places/Places';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PrivateOutlet from './auth/PrivateOutlet';
import PublicOutlet from './auth/PublicOutlet';

const App = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<PrivateOutlet />}>
          <Route path="/Places" element={<Places />} />
          <Route path="/Account" element={<UserAccountPage />} />

          <Route path="*" element={<Navigate to="Places" />} />
        </Route>

        <Route path="/" element={<PublicOutlet />}>
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
