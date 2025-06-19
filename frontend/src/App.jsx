import React from "react";
import HomePage from "./pages/user/HomePage";
import UserLayout from "./layouts/UserLayout";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/user/Signup";
import Login from "./pages/user/Login";
import AdminLogin from "./pages/admin/AdminLogin";

const App = () => {
  return (
    <div className="w-screen min-h-screen">
      <Routes>
        <Route
          path="/"
          element={
            <UserLayout>
              <HomePage />
            </UserLayout>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

export default App;
