// store/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "./index";
import api from "@/lib/axios";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  antiCsrfToken: string | null;
}

const initialState: AuthState = {
  user: null,
  antiCsrfToken: null,
};

// Create typed thunk with proper dispatch type
export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(logout());
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAndCsrf: (state, action: PayloadAction<{ user: User; antiCsrfToken: string }>) => {
      state.user = action.payload.user;
      state.antiCsrfToken = action.payload.antiCsrfToken;
    },
    logout: () => initialState,
  },
});

export const { setUserAndCsrf, logout } = authSlice.actions;
export default authSlice.reducer;