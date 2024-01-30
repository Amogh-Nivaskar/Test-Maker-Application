"use client";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
  name: string;
  email: string;
  image?: string;
}

const initialState: UserState = {
  name: "",
  email: "",
  image: "",
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;

export const selectUser = (state: RootState) => state.user;
