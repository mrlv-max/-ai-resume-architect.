import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeResume = async (file, jobDescription) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
        const response = await apiClient.post('/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw error;
    }
};

export const getOptimizationSuggestions = async (resumeText, jobDescription) => {
    try {
        const response = await apiClient.post('/optimize', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error('Error getting suggestions:', error);
        throw error;
    }
};

export const getSkillGapAnalysis = async (resumeText, jobDescription) => {
    try {
        const response = await apiClient.post('/skill-gap', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error('Error getting skill gap analysis:', error);
        throw error;
    }
};

export const rewriteResume = async (resumeText, jobDescription) => {
    try {
        const response = await apiClient.post('/rewrite', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error('Error rewriting resume:', error);
        throw error;
    }
};

export const generateLinkedInProfile = async (resumeText, jobDescription) => {
    try {
        const response = await apiClient.post('/linkedin-bio', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error('Error generating LinkedIn profile:', error);
        throw error;
    }
};

export const generateCoverLetter = async (resumeText, jobDescription) => {
    try {
        const response = await apiClient.post('/cover-letter', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error('Error generating cover letter:', error);
        throw error;
    }
};

export const generateInterviewQuestions = async (resumeText, jobDescription) => {
    try {
        const response = await apiClient.post('/interview-questions', { resumeText, jobDescription });
        return response.data;
    } catch (error) {
        console.error('Error generating interview questions:', error);
        throw error;
    }
};

export default apiClient;
