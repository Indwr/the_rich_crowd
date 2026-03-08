import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./auth.reducer";
import { type TeamTreeNode } from "src/features/tree/services/treeAPI";

interface TreeState {
  treeJson: TeamTreeNode | null;
}

const initialState: TreeState = {
  treeJson: null,
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setTreeCache: (state, action: PayloadAction<TeamTreeNode>) => {
      state.treeJson = action.payload;
    },
    clearTreeCache: (state) => {
      state.treeJson = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, (state) => {
      state.treeJson = null;
    });
  },
});

export const { setTreeCache, clearTreeCache } = treeSlice.actions;
export const treeReducer = treeSlice.reducer;

