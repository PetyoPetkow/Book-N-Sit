import { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../../firebase/firebase';
import { NextOrObserver, User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import UserDetails from '../../global/models/users/UserDetails';
import { subscribeToUser } from '../../firebase/services/UserService';

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  currentUserDetails: null,
  userLoggedIn: false,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const initializeUser: NextOrObserver<User> = (user) => {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);

      const unSub = subscribeToUser(currentUser.uid, setCurrentUserDetails);

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  const value = {
    currentUser,
    currentUserDetails,
    userLoggedIn,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

interface AuthContextProps {
  currentUser: User | null;
  currentUserDetails: UserDetails | null;
  userLoggedIn: boolean;
  loading: boolean;
}
