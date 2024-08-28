import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase/firebase';
import { NextOrObserver, User, onAuthStateChanged } from 'firebase/auth';
import UserDetails from '../../models/UserDetails';
import { subscribeToUser } from '../../firebase/services/UserService';

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  currentUserDetails: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails | null>(null);

  const initializeUser: NextOrObserver<User> = (user) => {
    if (user) {
      setCurrentUser({ ...user });
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, initializeUser);

    return unSub;
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unSub = subscribeToUser(currentUser.uid, setCurrentUserDetails);

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  const value = {
    currentUser,
    currentUserDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

interface AuthContextProps {
  currentUser: User | null;
  currentUserDetails: UserDetails | null;
}
