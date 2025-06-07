import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./redux/api/apiSlice"
import authReducer from "./redux/features/auth/authSlice"
import { setupListeners } from "@reduxjs/toolkit/query"

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
// This code sets up a Redux store for a Next.js application using RTK Query for API interactions and includes an authentication slice.
// It configures the store with the API slice and authentication reducer, applies middleware, and sets up listeners for query invalidation.