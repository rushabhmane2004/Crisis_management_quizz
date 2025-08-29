import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authslice';
// CORRECTED: 'gameSlice' now has a capital 'S'
import gameReducer from '../features/game/gameslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
});

export default store;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\app\store.js