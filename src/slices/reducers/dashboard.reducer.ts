import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./auth.reducer";
import {
  type DashboardProfileResponse,
  type UserPackage,
} from "../../features/dashboard/services/dashboardAPI";

interface DashboardState {
  dashboardResponse: DashboardProfileResponse | null;
  userPackages: UserPackage[];
}

const initialState: DashboardState = {
  dashboardResponse: null,
  userPackages: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardCache: (
      state,
      action: PayloadAction<{
        dashboardResponse: DashboardProfileResponse;
        userPackages: UserPackage[];
      }>
    ) => {
      state.dashboardResponse = action.payload.dashboardResponse;
      state.userPackages = action.payload.userPackages;
    },
    clearDashboardCache: (state) => {
      state.dashboardResponse = null;
      state.userPackages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, (state) => {
      state.dashboardResponse = null;
      state.userPackages = [];
    });
  },
});

export const { setDashboardCache, clearDashboardCache } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
