import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PublicOutlet = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  // useEffect(() => {
  //   if (userLoggedIn === true) {
  //     navigate('/home');
  //   }
  // }, [userLoggedIn, navigate]);

  return <Outlet />;
};

export default PublicOutlet;
