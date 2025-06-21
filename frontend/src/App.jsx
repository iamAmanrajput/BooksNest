import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import UserLayout from "./layouts/UserLayout";
import Signup from "./pages/user/Signup";
import Login from "./pages/user/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import Book from "./pages/user/Book";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Login />} />

        <Route
          path="/"
          element={
            <UserLayout>
              <HomePage />
            </UserLayout>
          }
        />

        <Route
          path="/book/:id"
          element={
            <UserLayout>
              <Book />
            </UserLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/signin" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

export default App;
