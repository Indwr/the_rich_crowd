import logger from 'redux-logger';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook } from 'react-redux';

import { apiSlice } from '../../slices/apis/app.api';

import { authReducer } from '../../slices/reducers/auth.reducer';
import { dashboardReducer } from '../../slices/reducers/dashboard.reducer';
import { profileReducer } from '../../slices/reducers/profile.reducer';
import { treeReducer } from '../../slices/reducers/tree.reducer';
import { directsReducer } from '../../slices/reducers/directs.reducer';
import { generationReducer } from '../../slices/reducers/generation.reducer';

import { persistReducer, persistStore } from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { env } from '../../utils/env';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const reducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  profile: profileReducer,
  tree: treeReducer,
  directs: directsReducer,
  generation: generationReducer,

  [apiSlice.reducerPath]: apiSlice.reducer,
});

const serialize = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    env.NODE_ENV === 'development'
      ? getDefaultMiddleware(serialize).concat(apiSlice.middleware, logger)
      : getDefaultMiddleware(serialize).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();