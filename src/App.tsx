import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserAccountPage from './pages/users/UserAccountPage';
import Header from './navigation/Header';
import Places from './pages/places/Places';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PrivateOutlet from './auth/PrivateOutlet';
import PublicOutlet from './auth/PublicOutlet';
import { useAuth } from './contexts/authContext';
import { useEffect } from 'react';
import i18n from './i18n/i18n';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase/firebase';
import { Container } from '@mui/material';

const App = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const setUserLanguage = async () => {
      if (currentUser !== null) {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.language) {
            i18n.changeLanguage(userData.language);
          }
        }
      }
    };

    setUserLanguage();
  }, [currentUser, i18n]);

  return (
    <div className="min-h-screen bg-slate-200">
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<PrivateOutlet />}>
            <Route path="/Account" element={<UserAccountPage />} />
            {/* <Route path="*" element={<Navigate to="Places" />} /> */}
            <Route path="/Places" element={<Places />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
          </Route>

          <Route path="/" element={<PublicOutlet />}>
            <Route path="/Places" element={<Places />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Container>
    </div>
  );
};

export default App;
