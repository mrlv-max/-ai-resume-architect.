require('dotenv').config();
const axios = require('axios');

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log("Fetching models from:", url.replace(apiKey, 'HIDDEN_KEY'));
        const response = await axios.get(url);
        console.log("Status:", response.status);
        if (response.data && response.data.models) {
            console.log("Available Models:");
            response.data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("No models found in response:", response.data);
        }
    } catch (error) {
        console.error("Error fetching models:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

listModelsRaw();
