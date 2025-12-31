require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    console.log("Listing models...");
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    // Note: older SDK versions might not have listModels exposed cleanly on the main class,
    // but let's try the standard way or handle error.
    try {
        // There isn't a direct listModels on GoogleGenerativeAI instance in some versions,
        // we might just have to try 'gemini-1.0-pro' or 'gemini-1.5-flash-001'

        // Let's try to infer from a common list if we can't fetch it, 
        // but typically we can just guess standard ones.
        // However, let's try a direct raw fetch if SDK doesn't support it easily.

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("SDK initialized.");

        // actually, the error message in previous step said:
        // "Call ListModels to see the list of available models"
        // This implies the API supports it.

        // We'll trust the docs: `gemini-1.5-flash` should work.
        // Maybe the issue is the key doesn't have access to 1.5?
        // Let's try 'gemini-pro' again but with error logging.

        // Actually, let's try 'gemini-1.0-pro'

    } catch (error) {
        console.error("Error:", error);
    }
}

// Just try a different model in the test script directly, simpler.
// I'll update the test script to try 'gemini-1.5-flash-001' which is the specific version.
