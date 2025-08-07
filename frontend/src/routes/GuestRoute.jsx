import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (isAuthenticated && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isAuthenticated && role === "user") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default GuestRoute;
