"use client";

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
  Admin = "admin",
  NonMember = "nonMember",
}

export interface ActiveOrganizationState {
  id: string;
  name: string;
  userRole: UserRole;
}

const initialState: ActiveOrganizationState = {
  id: "",
  name: "",
  userRole: UserRole.NonMember,
};

export const ActiveOrganizationSlice = createSlice({
  name: "activeOrganization",
  initialState,
  reducers: {
    setOrganization(state, action) {
      return action.payload;
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
  },
});

export const { setOrganization, setUserRole } = ActiveOrganizationSlice.actions;

export default ActiveOrganizationSlice.reducer;

export const selectUserRole = (state: RootState) =>
  state.activeOrganization.userRole;
