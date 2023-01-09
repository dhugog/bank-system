import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authActions";

interface AuthState {
  loading: boolean;
  error: string | null;
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  token: localStorage.getItem("access_token") ?? null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");

      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.token = action.payload;
    });

    builder.addCase(register.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.token = action.payload;
    });

    builder.addCase(login.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
