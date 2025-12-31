const express = require('express');
const router = express.Router();
const multer = require('multer');
const llmService = require('../services/llmService');
const nlpService = require('../services/nlpService');
const skillGapService = require('../services/skillGapService');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/analyze - Upload resume and job description for analysis
router.post('/analyze', upload.single('resume'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No resume file uploaded' });
        }

        const jobDescription = req.body.jobDescription;
        if (!jobDescription) {
            return res.status(400).json({ success: false, message: 'No job description provided' });
        }

        // 1. Extract text from resume
        const resumeText = await nlpService.extractText(req.file);

        // 2. Perform various analyses in parallel
        const [analysisResult, optimizationSuggestions, skillGapAnalysis] = await Promise.all([
            llmService.analyzeResume(resumeText, jobDescription),
            llmService.getOptimizationSuggestions(resumeText, jobDescription),
            skillGapService.analyzeSkillGap(resumeText, jobDescription)
        ]);

        res.json({
            success: true,
            data: {
                matchScore: analysisResult.matchScore,
                analysis: analysisResult.analysis,
                suggestions: optimizationSuggestions,
                skillGap: skillGapAnalysis,
                resumeText: resumeText
            }
        });

    } catch (error) {
        next(error);
    }
});

// POST /api/optimize - Get detailed optimization suggestions
router.post('/optimize', async (req, res, next) => {
    try {
        const { resumeText, jobDescription } = req.body;
        const suggestions = await llmService.getOptimizationSuggestions(resumeText, jobDescription);
        res.json({ success: true, data: suggestions });
    } catch (error) {
        next(error);
    }
});

// POST /api/skill-gap - Generate skill gap analysis
router.post('/skill-gap', async (req, res, next) => {
    try {
        const { resumeText, jobDescription } = req.body;
        const skillGap = await skillGapService.analyzeSkillGap(resumeText, jobDescription);
        res.json({ success: true, data: skillGap });
    } catch (error) {
        next(error);
    }
});

// POST /api/rewrite - Auto-rewrite resume text
router.post('/rewrite', async (req, res, next) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ success: false, message: 'Missing resume text or job description' });
        }
        const rewrittenText = await llmService.rewriteResume(resumeText, jobDescription);
        res.json({ success: true, data: { rewrittenText } });
    } catch (error) {
        next(error);
    }
});

// POST /api/linkedin-bio - Generate LinkedIn profile content
router.post('/linkedin-bio', async (req, res, next) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText) {
            return res.status(400).json({ success: false, message: 'Missing resume text' });
        }
        // Job description is optional but recommended
        const jd = jobDescription || "General Professional Role";

        const bioData = await llmService.generateLinkedInProfile(resumeText, jd);
        res.json({ success: true, data: bioData });
    } catch (error) {
        next(error);
    }
});

// POST /api/cover-letter - Generate Cover Letter
router.post('/cover-letter', async (req, res, next) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText) return res.status(400).json({ success: false, message: 'Missing resume text' });

        const letter = await llmService.generateCoverLetter(resumeText, jobDescription || "General Application");
        res.json({ success: true, data: { letter } });
    } catch (error) {
        next(error);
    }
});

// POST /api/interview-questions - Generate Mock Interview
router.post('/interview-questions', async (req, res, next) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText) return res.status(400).json({ success: false, message: 'Missing resume text' });

        const questions = await llmService.generateInterviewQuestions(resumeText, jobDescription || "General Application");
        res.json({ success: true, data: questions });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
