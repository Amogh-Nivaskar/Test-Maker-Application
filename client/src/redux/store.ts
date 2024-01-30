"use client";

import { configureStore } from "@reduxjs/toolkit";
import activeOrganizationReducer from "./slices/activeOrganization";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    activeOrganization: activeOrganizationReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
