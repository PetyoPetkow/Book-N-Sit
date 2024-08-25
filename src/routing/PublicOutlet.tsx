import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PublicOutlet = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== null) {
      navigate('/all');
    }
  }, [currentUser, navigate]);

  return <Outlet />;
};

export default PublicOutlet;
