// C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\features\game\gameservice.js
// Description: This new file handles all API calls related to game actions.
// It is responsible for adding the user's authentication token to the request headers.

import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/games/';

// Start a new game
const startGame = async (gameData, token) => {
  // Create the configuration object to send with the request
  const config = {
    headers: {
      // This is the crucial part that adds the token to the header
      'x-auth-token': token,
    },
  };

  // Make the POST request to the backend's /start endpoint
  const response = await axios.post(API_URL + 'start', gameData, config);
  return response.data;
};

// Get game details for an existing session
const getGameDetails = async (gameId, token) => {
    const config = {
        headers: {
            'x-auth-token': token,
        },
    };
    const response = await axios.get(API_URL + gameId, config);
    return response.data;
}

// Submit a player's decision for a question
const submitDecision = async (decisionData, token) => {
  // Destructure the gameId from the data to use in the URL
  const { gameId, ...rest } = decisionData;

  // --- Start of new logging ---
  console.log('%c[gameService] Preparing to submit decision.', 'color: #00AACC');
  console.log('[gameService] Game ID:', gameId);
  console.log('[gameService] Request Body:', rest); // Should show { questionIndex, answerIndex }
  console.log('[gameService] Auth Token:', token ? 'Token Present' : 'TOKEN IS MISSING!');
  // --- End of new logging ---

  // Safety check to ensure gameId exists
  if (!gameId) {
    console.error('[gameService] FATAL: gameId is missing. Cannot make API call.');
    throw new Error('Game ID is missing. The API call cannot be made.');
  }

  const config = {
    headers: {
      'x-auth-token': token,
    },
  };
  
  const requestUrl = API_URL + gameId + '/decision';
  console.log('[gameService] Making POST request to:', requestUrl);

  const response = await axios.post(requestUrl, rest, config);
  return response.data;
}

const gameService = {
  startGame,
  getGameDetails,
  submitDecision,
};

export default gameService;

//C:\Users\Rushabh\Desktop\SR TEST\frontend\frontend\src\features\game\gameservice.js