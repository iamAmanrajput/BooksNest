import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import UserLayout from "./layouts/UserLayout";
import Signup from "./pages/user/Signup";
import Signin from "./pages/user/Signin";
import Book from "./pages/user/Book";
import PageNotFound from "./components/common/PageNotFound";
import FeatureComingSoon from "./components/common/FeatureComingSoon";
import AllBooks from "./pages/user/AllBooks";
import MyHistory from "./pages/user/MyHistory";
import MyProfile from "./pages/user/MyProfile";
import UserRoute from "./routes/UserRoute";
import GuestRoute from "./routes/GuestRoute";
import AdminSignin from "./pages/admin/AdminSignin";
import AdminRoute from "./routes/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminBooks from "./pages/admin/AdminBooks";
import Requests from "./pages/admin/Requests";
import AllUsers from "./pages/admin/AllUsers";
import Analytics from "./pages/admin/Analytics";
import ForgotPassword from "./pages/user/forgotPassword";
import ResetPassword from "./pages/user/ResetPassword";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Routes>
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <GuestRoute>
              <Signin />
            </GuestRoute>
          }
        />

        <Route
          path="/"
          element={
            <UserRoute>
              <UserLayout>
                <HomePage />
              </UserLayout>
            </UserRoute>
          }
        />

        <Route
          path="/book/:bookId"
          element={
            <UserRoute>
              <UserLayout>
                <Book />
              </UserLayout>
            </UserRoute>
          }
        />

        <Route
          path="/books"
          element={
            <UserRoute>
              <UserLayout>
                <AllBooks />
              </UserLayout>
            </UserRoute>
          }
        />

        <Route
          path="/history"
          element={
            <UserRoute>
              <UserLayout>
                <MyHistory />
              </UserLayout>
            </UserRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserRoute>
              <UserLayout>
                <MyProfile />
              </UserLayout>
            </UserRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin/signin"
          element={
            <GuestRoute>
              <AdminSignin />
            </GuestRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminBooks />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <AllUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <AdminRoute>
              <AdminLayout>
                <Requests />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route path="/comingsoon" element={<FeatureComingSoon />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
