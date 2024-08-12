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
import { Container, ThemeProvider, createTheme } from '@mui/material';
import OverviewPage from './pages/places/Overview/OverviewPage';
import AddVenue from './pages/places/Venue/AddVenue';
import ScrollToTop from './navigation/ScrollToTop';
import Messages from './pages/messages/Messages';

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

  const theme = createTheme({
    palette: {
      primary: {
        main: '#006989',
      },
      error: {
        main: '#E88D67',
      },
      secondary: {
        main: '#F3F7EC',
      },
      success: {
        main: '#0D9276',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <div className="min-h-screen">
        <Header />
        <Container className="h-[calc(100vh-109px)]">
          <Routes>
            <Route path="/" element={<PrivateOutlet />}>
              <Route path="/Account" element={<UserAccountPage />} />
              <Route path="/AddVenue" element={<AddVenue />} />
              <Route path="/AddVenue/:venueId" element={<AddVenue />} />
              <Route path="/Places" element={<Places />} />
              <Route path="/Places/:venueName" element={<OverviewPage />} />
              <Route path="/Overview" element={<OverviewPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Register" element={<RegisterPage />} />
              <Route path="/Messages" element={<Messages />} />
            </Route>

            <Route path="/" element={<PublicOutlet />}>
              <Route path="/Places" element={<Places />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default App;
