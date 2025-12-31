const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    return new GoogleGenerativeAI(apiKey);
};

/**
 * Analyzes resume against job description using Gemini Pro
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<Object>} Analysis results including match score
 */
exports.analyzeResume = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are an expert AI Resume Architect and Recruiter. Analyze the following resume against the job description.
            
            RESUME:
            ${resumeText.substring(0, 10000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 5000)}
            
            Provide a detailed analysis in strictly JSON format. Do not include markdown code ticks (\`\`\`). The JSON structure must be:
            {
                "matchScore": number (0-100),
                "analysis": {
                    "summary": "Brief executive summary of the fit",
                    "strengths": ["List of key matching strengths"],
                    "weaknesses": ["List of missing critical skills or experience"],
                    "experienceMatch": "Assessment of experience level alignment",
                    "cultureFit": "Assessment of potential culture fit based on language"
                }
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // More robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback to original cleanup logic
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Error in analyzeResume:', error);
        throw error;
    }
};

/**
 * Generates specific optimization suggestions
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<Array>} List of suggestions
 */
exports.getOptimizationSuggestions = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Based on the resume and job description provided, give 5-7 high-impact, actionable suggestions to improve the resume for this specific role.
            Focus on keyword optimization, formatting, and highlighting relevant achievements.
            
            RESUME:
            ${resumeText.substring(0, 5000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 2000)}
            
            Return a strictly JSON object with a "suggestions" array. Do not include markdown code ticks. Structure:
            {
                "suggestions": [
                    {
                        "category": "Keywords" | "Formatting" | "Content" | "Impact",
                        "priority": "High" | "Medium" | "Low",
                        "suggestion": "The actionable advice",
                        "current": "What is currently in the resume",
                        "improved": "Example of how to rewrite it"
                    }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.suggestions || [];
    } catch (error) {
        console.error('Error in getOptimizationSuggestions:', error);
        return [];
    }
};

/**
 * Rewrites the resume text to be more impactful and ATS-friendly
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<string>} Rewritten resume text
 */
exports.rewriteResume = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are an expert Professional Resume Writer. 
            Rewrite the following resume content to be highly optimized for the provided Job Description.
            
            GOALS:
            1. Improve clarity and conciseness.
            2. Use strong action verbs and professional tone.
            3. Naturally incorporate key skills and keywords from the Job Description.
            4. fix any grammar or spelling errors.
            5. Maintain the original structure but polish the content.
            
            RESUME CONTENT:
            ${resumeText.substring(0, 5000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 2000)}
            
            Output ONLY the rewritten text of the resume. Do not include any conversational filler, explanations, or markdown code blocks. Just the raw text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error in rewriteResume:', error);
    }
};

/**
 * Generates LinkedIn profile content based on resume and job description
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<Object>} LinkedIn profile content
 */
exports.generateLinkedInProfile = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are an expert Personal Branding Strategist.
            Based on the provided resume and target job description, generate a high-impact LinkedIn profile optimization kit.
            
            RESUME:
            ${resumeText.substring(0, 5000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 1000)}
            
            Output a JSON object with the following structure. Do not use markdown code ticks.
            {
                "headlines": [
                    "Headline option 1 (Hook-based)",
                    "Headline option 2 (Role & Result based)",
                    "Headline option 3 (Keyword-rich)"
                ],
                "about": {
                    "story": "A compelling, narrative-driven About section (150 words)",
                    "professional": "A concise, achievement-focused About section (100 words)"
                },
                "skills": ["List of 15 top strategic skills for the Skills section (comma separated strings)"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Error in generateLinkedInProfile:', error);
        throw error;
    }
};

/**
 * Generates a tailored cover letter
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<string>} Cover letter text
 */
exports.generateCoverLetter = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            You are an expert Career Coach and Professional Writer.
            Write a highly personalized, persuasive cover letter based on the candidate's resume and the job description.
            
            STRUCTURE:
            1.  **Header**: [Candidate Name] | [Email] | [Phone]
            2.  **Salutation**: Professional greeting.
            3.  **The Hook**: Open with a strong statement connecting the candidate's passion/experience to the company's mission/role.
            4.  **The Evidence** (2 paragraphs): specifically map 2-3 key achievements from the resume to the top requirements in the Job Description. Use metrics where possible.
            5.  **The Closing**: Confident call to action.
            
            TONE: Professional, enthusiastic, confident, but not arrogant.
            
            RESUME:
            ${resumeText.substring(0, 5000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 2000)}
            
            Output ONLY the cover letter text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error in generateCoverLetter:', error);
        throw error;
    }
};

/**
 * Generates mock interview questions based on gaps and JD
 * @param {string} resumeText 
 * @param {string} jobDescription 
 * @returns {Promise<Array>} List of Q&A objects
 */
exports.generateInterviewQuestions = async (resumeText, jobDescription) => {
    try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Act as a Hiring Manager for this specific role. 
            Review the candidate's resume against the Job Description.
            Identify the apparent weaknesses, gaps, or areas where the candidate needs to prove themselves.
            
            Generate 5 tough, high-value interview questions.
            - 3 Technical/Role-Specific questions probing their depth.
            - 2 Behavioral questions targeting potential soft-skill gaps or culture fit.
            
            RESUME:
            ${resumeText.substring(0, 5000)}
            
            JOB DESCRIPTION:
            ${jobDescription.substring(0, 2000)}
            
            Output a JSON object with a "questions" array. No markdown.
            Structure:
            {
                "questions": [
                    {
                        "type": "Technical" | "Behavioral",
                        "question": "The actual question",
                        "context": "Why you are asking this (what gap does it target?)",
                        "answer_tip": "Advice on how to answer this using the STAR method"
                    }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.questions || [];
    } catch (error) {
        console.error('Error in generateInterviewQuestions:', error);
        throw error;
    }
};
