import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // While checking for the user, show a spinner
  if (isLoading) {
    return <Spinner />;
  }

  // If user is logged in, show the requested page. Otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;