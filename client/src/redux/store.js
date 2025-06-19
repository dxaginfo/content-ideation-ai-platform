import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import ideasReducer from './ideasSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    ui: uiReducer,
  },
});

export default store;