import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./auth.reducer";
import { type GenerationUser } from "src/features/team/services/generationAPI";

interface GenerationState {
  levelUsers: Record<string, GenerationUser[]>;
}

const initialState: GenerationState = {
  levelUsers: {},
};

const generationSlice = createSlice({
  name: "generation",
  initialState,
  reducers: {
    setGenerationCache: (
      state,
      action: PayloadAction<Record<string, GenerationUser[]>>
    ) => {
      state.levelUsers = action.payload;
    },
    clearGenerationCache: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, () => initialState);
  },
});

export const { setGenerationCache, clearGenerationCache } = generationSlice.actions;
export const generationReducer = generationSlice.reducer;
