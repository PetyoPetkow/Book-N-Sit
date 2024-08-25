import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateOutlet = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return <Outlet />;
};

export default PrivateOutlet;
