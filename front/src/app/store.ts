import {
  configureStore,
  ThunkAction,
  Action,
  ConfigureStoreOptions,
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authReducer from "../features/auth/authSlice";
import sideMenuReducer from "../features/side-menu/sideMenuSlice";
import { api } from "./api";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const message =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.data?.message ??
            action.payload?.message ??
            action.error.message;

      toast.error(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    return next(action);
  };

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      auth: authReducer,
      sideMenu: sideMenuReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, rtkQueryErrorLogger),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
