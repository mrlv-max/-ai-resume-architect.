require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini API...");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    console.log("API Key found:", apiKey.substring(0, 5) + "...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = "Hello! Are you working? Reply with 'Yes, I am functional'.";

        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Response received:");
        console.log(text);
        console.log("✅ Test Passed");
    } catch (error) {
        console.error("❌ Test Failed:", error.message);
        if (error.response) {
            console.error("Error details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
