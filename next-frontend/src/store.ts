import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/features/auth/authSlice"
import { userApiSlice } from "./redux/api/userApiSlice";




const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;