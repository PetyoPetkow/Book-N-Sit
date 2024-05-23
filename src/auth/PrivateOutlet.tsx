import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateOutlet = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  // useEffect(() => {
  //   if (userLoggedIn === false) {
  //     navigate('/Login');
  //   }
  // }, [userLoggedIn, navigate]);

  return <Outlet />;
};

export default PrivateOutlet;
