import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import UserLayout from "./layouts/UserLayout";
import Signup from "./pages/user/Signup";
import Login from "./pages/user/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import Book from "./pages/user/Book";
import PageNotFound from "./components/common/PageNotFound";
import FeatureComingSoon from "./components/common/FeatureComingSoon";
import AllBooks from "./pages/user/AllBooks";
import MyHistory from "./pages/user/MyHistory";
import MyProfile from "./pages/user/MyProfile";

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
          path="/book/:bookId"
          element={
            <UserLayout>
              <Book />
            </UserLayout>
          }
        />

        <Route
          path="/books"
          element={
            <UserLayout>
              <AllBooks />
            </UserLayout>
          }
        />

        <Route
          path="/history"
          element={
            <UserLayout>
              <MyHistory />
            </UserLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <UserLayout>
              <MyProfile />
            </UserLayout>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/signin" element={<AdminLogin />} />
        <Route path="/comingsoon" element={<FeatureComingSoon />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
