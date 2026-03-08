import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./auth.reducer";
import { type DirectUser } from "src/features/team/services/directsAPI";

interface DirectsState {
  list: DirectUser[];
  totalCount: number;
  activeUserId: string;
}

const initialState: DirectsState = {
  list: [],
  totalCount: 0,
  activeUserId: "",
};

const directsSlice = createSlice({
  name: "directs",
  initialState,
  reducers: {
    setDirectsCache: (
      state,
      action: PayloadAction<{ list: DirectUser[]; totalCount: number; activeUserId: string }>
    ) => {
      state.list = action.payload.list;
      state.totalCount = action.payload.totalCount;
      state.activeUserId = action.payload.activeUserId;
    },
    clearDirectsCache: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, () => initialState);
  },
});

export const { setDirectsCache, clearDirectsCache } = directsSlice.actions;
export const directsReducer = directsSlice.reducer;

