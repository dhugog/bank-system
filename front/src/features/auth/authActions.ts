import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "auth/register",
  async (
    args: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        "http://localhost/api/auth/register",
        args
      );

      localStorage.setItem("access_token", data.token);

      return data.token;
    } catch (err: any) {
      const message = err.response?.data?.message ?? err.message;

      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (args: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost/api/auth/login",
        args
      );

      localStorage.setItem("access_token", data.token);

      return data.token;
    } catch (err: any) {
      const message = err.response?.data?.message ?? err.message;

      return rejectWithValue(message);
    }
  }
);
