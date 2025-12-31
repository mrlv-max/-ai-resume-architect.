const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    return new GoogleGenerativeAI(apiKey);
};

/**
 * Analyzes skill gap between resume and job description
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<Object>} Skill gap analysis
 */
exports.analyzeSkillGap = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Perform a detailed skill gap analysis between the candidate's resume and the job description.
            Identify skills that are Present (matched), Missing (required but not found), and Bonus (found but not strictly required).
            
            RESUME:
            ${resumeText.substring(0, 5000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 2000)}
            
            Return a strictly JSON object. Do not use markdown code ticks. Structure:
            {
                "presentSkills": ["skill1", "skill2"],
                "missingSkills": ["skill3", "skill4"],
                "bonusSkills": ["skill5"],
                "skillMatchPercentage": number (0-100),
                "radarChartData": {
                    "labels": ["Technical", "Soft Skills", "Domain Knowledge", "Tools", "Leadership"],
                    "current": [score 1-10 for each label],
                    "required": [score 1-10 for each label]
                }
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Error in analyzeSkillGap:', error);
        throw error;
    }
};
