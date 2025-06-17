import React from "react";
import HomePage from "./pages/user/HomePage";
import UserLayout from "./layouts/UserLayout";

const App = () => {
  return (
    <div className="w-screen min-h-screen">
      <UserLayout>
        <HomePage />
      </UserLayout>
    </div>
  );
};

export default App;
