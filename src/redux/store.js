import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";

// use persist for life long storage
export const store = configureStore({
  reducer: combineReducers({
    auth: authSlice,
    user: userSlice,
  }),
});
