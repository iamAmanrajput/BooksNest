import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setUserLogout } from "@/redux/slices/authSlice";

const AdminRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();
  const { pathname } = location;
  const [forceLogout, setForceLogout] = useState(false);

  useEffect(() => {
    if (isAuthenticated && role !== "admin") {
      dispatch(setUserLogout());
      setForceLogout(true);
    }
  }, [isAuthenticated, role, dispatch]);

  if (forceLogout) {
    return <Navigate to="/admin/signin" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }

  return children;
};

export default AdminRoute;
