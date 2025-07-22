import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  pagination: {
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  },
  loading: { fetchUsersLoading: false },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.users = action.payload.data;
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
    setLoading: (state, action) => {
      state.loading = { ...state.loading, ...action.payload };
    },
    setAccountStatus: (state, action) => {
      state.users = state.users.map((user) => {
        return user._id === action.payload.userId
          ? { ...user, isBlocked: action.payload.status }
          : user;
      });
    },
  },
});

export const { setData, setLoading, setAccountStatus } = usersSlice.actions;
export default usersSlice.reducer;
