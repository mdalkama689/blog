import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthWrapper = () => {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AuthWrapper;
