import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gameService from './gameservice';

const initialState = {
  gameSession: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Thunks (startGame, getGameDetails) remain the same...
export const startGame = createAsyncThunk('game/start', async (gameData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await gameService.startGame(gameData, token);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getGameDetails = createAsyncThunk('game/getDetails', async (gameId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await gameService.getGameDetails(gameId, token);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const submitDecision = createAsyncThunk('game/submitDecision', async (decisionData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await gameService.submitDecision(decisionData, token);
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});


export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gameSession = action.payload;
      })
      .addCase(startGame.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGameDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGameDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gameSession = action.payload;
      })
      .addCase(getGameDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ✅ THIS IS THE CRITICAL TEST
      .addCase(submitDecision.fulfilled, (state, action) => {
        console.log('%c[gameSlice] Reducer: submitDecision.fulfilled is RUNNING!', 'color: lightgreen; font-size: 16px;');
        console.log('[gameSlice] The new game session from the server is:', action.payload);
        
        state.isLoading = false;
        state.isSuccess = true;
        state.gameSession = action.payload; // This line updates the state
      })
      .addCase(submitDecision.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = gameSlice.actions;
export default gameSlice.reducer;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\features\game\gameslice.js