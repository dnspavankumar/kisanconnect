/**
 * Kisan Connect - Backend Server
 * This server handles the communication between the frontend and Google Gemini AI.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables (like API keys) from the .env file
dotenv.config();

const app = express();
// The port the server will run on (default 8081)
const port = process.env.PORT || 8081;

// MIDDLEWARE
// CORS allows our frontend (port 5173/8080) to talk to this backend
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
// This allows the server to understand JSON data sent in requests
app.use(express.json());

// Log every single request that hits our server
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] 📥 ${req.method} request to: ${req.url}`);
    next();
});

// Simple test to see if server is alive
app.get('/', (req, res) => {
    res.send('KisanConnect Server is Active!');
});

// INITIALIZE GEMINI AI
// We use the API Key stored in the .env file for security
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('❌ ERROR: Gemini API Key is missing! Please check server/.env');
} else {
    console.log('✅ Gemini API Key loaded successfully.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log('🤖 AI Model 1.5 Flash initialized.');

/**
 * CHAT ENDPOINT
 * This is the URL the frontend calls to get AI responses.
 * Endpoint: POST http://localhost:5000/chat
 */
app.post('/chat', async (req, res) => {
    try {
        const { message, language, uiLanguage, userLanguage } = req.body;

        // Safety Fallbacks
        const targetLanguage = uiLanguage || language || 'en';
        const detectedLanguage = userLanguage || 'en';

        console.log(`[${new Date().toLocaleTimeString()}] 💬 Chat Request | Target: ${targetLanguage} | Msg: ${message.substring(0, 30)}...`);

        const modelName = "gemini-flash-latest";
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: `You are KisanMitra, a helpful Indian farming assistant. 
            - The user types in ${detectedLanguage === 'hi' ? 'Hindi' : detectedLanguage === 'te' ? 'Telugu' : 'English'}.
            - ALWAYS respond in ${targetLanguage === 'hi' ? 'Hindi' : targetLanguage === 'te' ? 'Telugu' : 'English'}.
            - Even if the user message is in a different language than the UI, use the UI language for your response.
            - DO NOT use any markdown (*, **, ###). Use only plain text.
            - LIMIT response to maximum 5-6 points total.
            - Keep each point to only 1 or 2 lines maximum.
            - Add one empty line between every point.
            - Use very simple everyday language that farmers understand.
            - Never write long paragraphs.`
        });

        // Send the user message to Gemini
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Localized suggestions dictionary
        const suggestionsDict = {
            en: [
                "🌾 How to prepare soil?",
                "🌱 Best seeds for beginners",
                "🛡️ Pest control tips",
                "☁️ Weather update"
            ],
            hi: [
                "🌾 मिट्टी कैसे तैयार करें?",
                "🌱 शुरुआती लोगों के लिए बेहतर बीज",
                "🛡️ कीट नियंत्रण के सुझाव",
                "☁️ मौसम की जानकारी"
            ],
            te: [
                "🌾 మట్టిని ఎలా సిద్ధం చేయాలి?",
                "🌱 ప్రారంభకులకు ఉత్తమ విత్తనాలు",
                "🛡️ తెగులు నివారణ చిట్కాలు",
                "☁️ వాతావరణ సమాచారం"
            ]
        };

        // Send the AI's reply back to the user
        // Use uiLanguage for suggestions
        const currentLang = uiLanguage || language || 'en';

        res.json({
            role: 'assistant',
            content: text,
            suggestions: suggestionsDict[currentLang] || suggestionsDict.en,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        // This will now send the REAL error message to the chat bubble
        res.status(500).json({
            error: true,
            content: `AI Error: ${error.message}. Please check your API key in server/.env`
        });
    }
});

// START THE SERVER
app.listen(port, () => {
    console.log('---------------------------------------------');
    console.log(`🚀 KisanConnect Backend is running!`);
    console.log(`📡 URL: http://localhost:${port}`);
    console.log('---------------------------------------------');
});
