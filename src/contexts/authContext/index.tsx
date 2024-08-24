import { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../../firebase/firebase';
import { NextOrObserver, User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import UserDetails from '../../global/models/users/UserDetails';

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  userDetails: null,
  userLoggedIn: false,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
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

      const unSub = onSnapshot(doc(firestore, 'users', currentUser.uid), (doc) => {
        doc.exists() && setUserDetails(doc.data() as UserDetails);
      });

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userDetails,
    userLoggedIn,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

interface AuthContextProps {
  currentUser: User | null;
  userDetails: UserDetails | null;
  userLoggedIn: boolean;
  loading: boolean;
}
