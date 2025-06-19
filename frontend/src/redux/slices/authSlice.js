import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: localStorage.getItem("role") || "",
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      const { user, token } = action.payload;
      state.role = user.role;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", token);
    },
    setUserLogout: (state) => {
      state.user = null;
      state.role = "";
      state.isAuthenticated = false;

      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setUserLogin, setUserLogout } = authSlice.actions;
export default authSlice.reducer;
