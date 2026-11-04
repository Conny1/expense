import { configureStore } from "@reduxjs/toolkit";
import { expenseApi } from "./expenseApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import tokenReducer from "./token";

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(expenseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
