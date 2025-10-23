import { User } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "../../api/authApiSlice";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: { payload: { token: string; user: User } }
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          // Assuming the payload has a `token` and `user` property
          state.token = payload.accessToken;
          state.user = payload.user;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          // Assuming the payload has a `token` and `user` property
          state.token = payload.token;
          state.user = payload.user;
        }
      );
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
