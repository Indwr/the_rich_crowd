import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logoutUser } from "./auth.reducer";
import { type UserProfileData } from "src/features/profile/services/profileAPI";

interface ProfileFormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  city: string;
  state: string;
}

interface ProfileIdentityState {
  user_id: string;
  eth_address: string;
  sponser_id: string;
}

interface ProfileState {
  identity: ProfileIdentityState;
  form: ProfileFormState;
}

const initialState: ProfileState = {
  identity: {
    user_id: "",
    eth_address: "",
    sponser_id: "",
  },
  form: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    city: "",
    state: "",
  },
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    hydrateProfile: (state, action: PayloadAction<UserProfileData>) => {
      const payload = action.payload;
      state.identity = {
        user_id: payload.user_id ?? "",
        eth_address: payload.eth_address ?? "",
        sponser_id: payload.sponser_id ?? "",
      };
      state.form = {
        first_name: payload.first_name ?? "",
        last_name: payload.last_name ?? "",
        email: payload.email ?? "",
        phone: payload.phone ?? "",
        dob: payload.dob ?? "",
        city: payload.city ?? "",
        state: payload.state ?? "",
      };
    },
    setProfileField: (
      state,
      action: PayloadAction<{ field: keyof ProfileFormState; value: string }>
    ) => {
      state.form[action.payload.field] = action.payload.value;
    },
    clearProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, () => initialState);
  },
});

export const { hydrateProfile, setProfileField, clearProfile } =
  profileSlice.actions;
export const profileReducer = profileSlice.reducer;

