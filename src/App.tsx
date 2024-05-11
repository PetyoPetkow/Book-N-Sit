import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserAccountPage from './pages/users/UserAccountPage';
import Header from './navigation/Header';
import Places from './pages/places/Places';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Places />} />
        <Route path="/account" element={<UserAccountPage />} />
      </Routes>
    </>
  );
};

export default App;
