import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setUserLogout } from "@/redux/slices/authSlice";

const UserRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const [forceLogout, setForceLogout] = useState(false);

  useEffect(() => {
    if (isAuthenticated && role !== "user") {
      dispatch(setUserLogout());
      setForceLogout(true);
    }
  }, [isAuthenticated, role, dispatch]);

  if (forceLogout) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default UserRoute;
