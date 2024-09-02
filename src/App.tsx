import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './navigation/Header';
import VenuesPage from './pages/venue/VenuesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PrivateOutlet from './routing/PrivateOutlet';
import PublicOutlet from './routing/PublicOutlet';
import { useAuth } from './contexts/authContext';
import { useEffect } from 'react';
import i18n from './i18n/i18n';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase/firebase';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import OverviewPage from './pages/overview/OverviewPage';
import AddVenue from './pages/venue/AddVenue';
import ScrollToTop from './navigation/ScrollToTop';
import Messages from './pages/messages/Messages';
import ManageAccount from './pages/manageAccount/ManageAccount';
import ResetPasswordPage from './pages/auth/ResetPassword';

const App = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('all');
    }
  }, [navigate, window.location.pathname]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#006989',
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
      <div className="min-h-[100vh] flex flex-col overflow-hidden bg-[url('./assets/stockImg3.jpg')] bg-no-repeat bg-fixed bg-cover">
        <Header />
        <Container disableGutters className="flex-grow flex flex-col ">
          <Routes>
            <Route path="/" element={<PrivateOutlet />}>
              <Route path="addVenue" element={<AddVenue />} />
              <Route path="myVenues" element={<VenuesPage />} />
              <Route path="editVenue/:venueId" element={<AddVenue />} />
              <Route path="messages" element={<Messages />} />
              <Route path="manageAccount" element={<ManageAccount />} />
            </Route>

            <Route path="/" element={<PublicOutlet />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="resetPassword" element={<ResetPasswordPage />} />
            </Route>

            <Route path="/">
              <Route path=":category?">
                <Route index element={<VenuesPage />} />
                <Route path=":venueId" element={<OverviewPage />} />
              </Route>
            </Route>
          </Routes>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default App;
