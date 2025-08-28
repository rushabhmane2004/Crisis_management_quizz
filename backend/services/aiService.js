// File: server/services/aiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * ✅ NEW HELPER FUNCTION
 * Selects the correct API key based on the game mode, creates a new AI instance,
 * and returns the generative model. This replaces the single global model.
 * @param {string} mode - The mode of the scenario (e.g., 'Multiplayer Challenge').
 * @returns {object} An initialized Google Generative AI model instance.
 */
const getModelForMode = (mode) => {
  let apiKey;
  let selectedMode = 'Default'; // Start with a default label

  switch (mode) {
    case 'Multiplayer Challenge':
      apiKey = process.env.GEMINI_API_KEY_MULTIPLAYER;
      selectedMode = 'Multiplayer Challenge';
      break;
    case 'Policy & Governance':
      apiKey = process.env.GEMINI_API_KEY_POLICY;
      selectedMode = 'Policy & Governance';
      break;
    case 'Crisis Olympics':
      apiKey = process.env.GEMINI_API_KEY_CRISIS_OLYMPICS;
      selectedMode = 'Crisis Olympics';
      break;
    case 'Real-World Simulation':
      apiKey = process.env.GEMINI_API_KEY_REALWORLD;
      selectedMode = 'Real-World Simulation';
      break;
    case 'AI vs. Human Battle':
      apiKey = process.env.GEMINI_API_KEY_AI_VS_HUMAN;
      selectedMode = 'AI vs. Human Battle';
      break;
    default:
      // This is the fallback for Single Player or any unrecognized mode
      apiKey = process.env.GEMINI_API_KEY;
      selectedMode = `Default/Single-Player (mode received: '${mode}')`;
      break;
  }

  console.log(`[AI Service] Selecting API Key for mode: ${selectedMode}`);

  if (!apiKey) {
    throw new Error(`API key for mode "${selectedMode}" is not configured in the .env file.`);
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};


/**
 * @desc Generates situational questions for a game.
 * ✅ UPDATED to accept a 'mode' to select the correct API key.
 */
exports.generateSituationalQuestions = async (context, mode, count = 3) => {
  const prompt = `
    Act as the "Lord KALKI Judgment System" for a corporate personality assessment game.
    Your task is to generate EXACTLY ${count} situational multiple-choice questions based on the context of: "${context}".

    YOU MUST ADHERE TO THE FOLLOWING RULES:
    1.  The output MUST be a single, valid JSON array.
    2.  The array MUST contain EXACTLY ${count} question objects.
    3.  Each question object MUST have two keys: "questionText" (a string) and "options" (an array).
    4.  The "options" array for each question MUST contain EXACTLY 4 option objects.
    5.  Each option object MUST have two keys: "text" (a string) and "score" (an integer: 20, 15, 10, or 5).
    6.  DO NOT include any extra text, explanations, or markdown like \`\`\`json. Output ONLY the raw JSON array.
  `;
  
  let text = ''; // Declare here to be accessible in the catch block
  try {
    // ✅ Use the helper function to get the model for the specific game mode
    const model = getModelForMode(mode);

    const result = await model.generateContent(prompt);
    text = result.response.text();
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(jsonText);

    console.log('--- Successfully Generated AI Questions ---');
    console.log(JSON.stringify(questions, null, 2));
    console.log('-----------------------------------------');

    return questions;
  } catch (error) {
    console.error('Error generating or parsing questions with Gemini API:', error);
    console.error('--- AI Raw Output that caused error ---');
    console.error(text); // Log the raw text that failed to parse
    console.error('------------------------------------');
    throw new Error('Failed to generate valid questions from AI.');
  }
};


/**
 * @desc Evaluates user-submitted policy text.
 * ✅ UPDATED to use the dynamic model selector.
 */
exports.evaluatePolicyText = async (policyText, context) => {
  const prompt = `
    Act as the "Lord KALKI Judgment System." Your task is to evaluate a user-submitted policy for a crisis management scenario.

    Crisis context: "${context}"
    User's policy: "${policyText}"

    Provide a JSON object in this exact format:
    {
      "evaluation": "Detailed, constructive feedback.",
      "scores": {
        "RiskMitigation": 0,
        "DecisionEffectiveness": 0,
        "EthicalResponsibility": 0,
        "PASSIONIT_PRUTL": 0
      },
      "totalScore": 0
    }

    Scoring rules:
    - RiskMitigation (0–30)
    - DecisionEffectiveness (0–30)
    - EthicalResponsibility (0–20)
    - PASSIONIT_PRUTL (0–20)
    - "totalScore" must be the sum of all four scores.
  `;

  try {
    // ✅ Explicitly get the model for the 'Policy & Governance' mode
    const model = getModelForMode('Policy & Governance');
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(jsonText);
    
    console.log('--- Successfully Generated AI Policy Evaluation ---');
    console.log(JSON.stringify(evaluation, null, 2));
    console.log('-------------------------------------------------');

    return evaluation;
  } catch (error) {
    console.error('Error evaluating policy with Gemini API:', error);
    throw new Error('Failed to evaluate policy.');
  }
};