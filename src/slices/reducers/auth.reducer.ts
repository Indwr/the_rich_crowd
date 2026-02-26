import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../../store/redux/initialState';
import { apiSlice } from '../apis/app.api';
import { type ISigninRes } from '../apis/types.ts';

interface UpdateUserPayload {
  email?: string;
  fullName?: string;
  role?: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState.user,

  reducers: {
    logoutUser: (state) => {
      state.email = '';
      state.fullName = '';
      state.role = '';
      state.token = '';
    },

    updateUserDetails: (state, action: PayloadAction<UpdateUserPayload>) => {
      const { email, fullName, role } = action.payload;
      if (email !== undefined) state.email = email;
      if (fullName !== undefined) state.fullName = fullName;
      if (role !== undefined) state.role = role;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.signin.matchFulfilled,
      (state, action: PayloadAction<ISigninRes>) => {
        state.email = action.payload.resultData.user.email;
        state.fullName = action.payload.resultData.user.fullName;
        state.role = action.payload.resultData.user.role;
        state.token = action.payload.resultData.token;
      }
    );
  },
});

export const { logoutUser, updateUserDetails } = authSlice.actions;

export const authReducer = authSlice.reducer;