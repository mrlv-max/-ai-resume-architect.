import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SkillGapChart from '../components/SkillGapChart';
import OptimizationSuggestions from '../components/OptimizationSuggestions';
import { rewriteResume, generateLinkedInProfile, generateCoverLetter, generateInterviewQuestions } from '../services/apiClient';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);
    const [linkedInBio, setLinkedInBio] = useState(null);
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [activeBioTab, setActiveBioTab] = useState('headlines'); // headlines, about, skills

    // New Features State
    const [coverLetter, setCoverLetter] = useState('');
    const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
    const [interviewQuestions, setInterviewQuestions] = useState(null);
    const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

    const [jobDescription, setJobDescription] = useState('');

    useEffect(() => {
        if (!location.state?.data) {
            navigate('/');
            return;
        }
        setData(location.state.data);
        setEditedText(location.state.data.resumeText || '');
        setJobDescription(location.state.jobDescription || "Professional Industry Standards");
    }, [location, navigate]);

    if (!data) return null;

    const { matchScore, analysis, suggestions, skillGap } = data;

    // ... existing helpers ...

    const handleGenerateCoverLetter = async () => {
        if (!editedText) return;
        setIsGeneratingLetter(true);
        try {
            const result = await generateCoverLetter(editedText, jobDescription);
            if (result && result.success && result.data.letter) {
                setCoverLetter(result.data.letter);
            }
        } catch (error) {
            console.error("Cover Letter generation failed", error);
            alert("Failed to generate Cover Letter.");
        } finally {
            setIsGeneratingLetter(false);
        }
    };

    const handleGenerateInterview = async () => {
        if (!editedText) return;
        setIsGeneratingInterview(true);
        try {
            const result = await generateInterviewQuestions(editedText, jobDescription);
            if (result && result.success) {
                setInterviewQuestions(result.data);
            }
        } catch (error) {
            console.error("Interview generation failed", error);
            alert("Failed to generate Interview Questions.");
        } finally {
            setIsGeneratingInterview(false);
        }
    };

    // ... existing handlers ...

    // determine score color
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const handleExportReport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            matchScore,
            analysis,
            skillGap,
            suggestions
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `career-architecture-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadResume = () => {
        const blob = new Blob([editedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimized-resume-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAutoRewrite = async () => {
        if (!editedText) return;

        setIsRewriting(true);
        try {
            const result = await rewriteResume(editedText, jobDescription);
            if (result && result.success && result.data.rewrittenText) {
                setEditedText(result.data.rewrittenText);
            }
        } catch (error) {
            console.error("Rewrite failed", error);
            alert("Failed to rewrite resume. Please try again.");
        } finally {
            setIsRewriting(false);
        }
    };

    const handleGenerateLinkedIn = async () => {
        if (!editedText) return;
        setIsGeneratingBio(true);
        try {
            const result = await generateLinkedInProfile(editedText, jobDescription);
            if (result && result.success) {
                setLinkedInBio(result.data);
            }
        } catch (error) {
            console.error("LinkedIn Bio generation failed", error);
            alert("Failed to generate LinkedIn profile. Please try again.");
        } finally {
            setIsGeneratingBio(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="pb-20 pt-10 px-4 animate-fade-in text-white/90">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    ← Start New Analysis
                </button>

                <button
                    onClick={handleExportReport}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    Export Strategy Report
                </button>
            </div>

            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center">
                    <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-4">ATS Compatibility Score</h2>
                    <div className={`text-8xl font-black ${getScoreColor(matchScore)}`}>
                        {matchScore}%
                    </div>
                </div>

                <div className="md:col-span-2 glass-card p-8">
                    <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{analysis.summary}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-2">Key Strengths</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                {analysis.strengths.slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-red-400 mb-2">Critical Gaps</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                {analysis.weaknesses.slice(0, 3).map((w, i) => <li key={i}>• {w}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualizations & Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                <div className="space-y-8">
                    <div className="glass-card p-6 h-[500px]">
                        <h3 className="text-xl font-bold mb-6">Skill Gap Visualization</h3>
                        <SkillGapChart data={skillGap} />
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold mb-4">Skills Inventory</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs text-gray-500 uppercase w-full mb-2">Matched Skills</span>
                            {skillGap.presentSkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-green-300 text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500 uppercase w-full mb-2">Missing Skills</span>
                            {skillGap.missingSkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-red-900/30 border border-red-500/30 rounded-full text-red-300 text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Optimization Action Plan</h3>
                        <OptimizationSuggestions suggestions={suggestions} />
                    </div>
                </div>
            </div>

            {/* LinkedIn Bio Generator Section */}
            <div className="glass-card p-8 mb-12 animate-fade-in border-t border-blue-500/30">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-blue-400">in</span> LinkedIn Optimizer
                        </h3>
                        <p className="text-gray-400 text-sm">Generate viral headlines and compelling about sections.</p>
                    </div>
                    <button
                        onClick={handleGenerateLinkedIn}
                        disabled={isGeneratingBio}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${isGeneratingBio ? 'bg-blue-900/50' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/50'}`}
                    >
                        {isGeneratingBio ? 'Generating...' : 'Generate Profile Kit'}
                    </button>
                </div>

                {linkedInBio && (
                    <div className="bg-black/20 rounded-xl p-6">
                        <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
                            {['headlines', 'about', 'skills'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveBioTab(tab)}
                                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors capitalize ${activeBioTab === tab ? 'bg-blue-500/20 text-blue-300' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[200px]">
                            {activeBioTab === 'headlines' && (
                                <div className="space-y-4">
                                    {linkedInBio.headlines.map((headline, i) => (
                                        <div key={i} className="group relative bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
                                            <p className="text-gray-200 pr-10">{headline}</p>
                                            <button
                                                onClick={() => copyToClipboard(headline)}
                                                className="absolute right-4 top-4 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Copy"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeBioTab === 'about' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <h4 className="text-blue-400 text-sm font-bold mb-3 uppercase">Story Driven</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{linkedInBio.about.story}</p>
                                        <button onClick={() => copyToClipboard(linkedInBio.about.story)} className="mt-4 text-xs text-blue-400 hover:text-blue-300">Copy to Clipboard</button>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-lg">
                                        <h4 className="text-blue-400 text-sm font-bold mb-3 uppercase">Professional & Concise</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{linkedInBio.about.professional}</p>
                                        <button onClick={() => copyToClipboard(linkedInBio.about.professional)} className="mt-4 text-xs text-blue-400 hover:text-blue-300">Copy to Clipboard</button>
                                    </div>
                                </div>
                            )}

                            {activeBioTab === 'skills' && (
                                <div>
                                    <p className="text-gray-400 text-sm mb-4">Copy these to your "Skills" section for better search visibility.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {linkedInBio.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-blue-900/20 border border-blue-500/20 text-blue-300 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <button onClick={() => copyToClipboard(linkedInBio.skills.join(', '))} className="mt-6 text-sm text-gray-400 hover:text-white flex items-center gap-2">
                                        📋 Copy All Skills
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Cover Letter Generator */}
                <div className="glass-card p-6 animate-fade-in border-t border-purple-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Cover Letter Writer</h3>
                        <button
                            onClick={handleGenerateCoverLetter}
                            disabled={isGeneratingLetter}
                            className={`text-sm px-4 py-2 rounded-lg transition-colors ${isGeneratingLetter ? 'bg-purple-900/50' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {isGeneratingLetter ? 'Writing...' : 'Draft Letter'}
                        </button>
                    </div>

                    {coverLetter ? (
                        <div className="bg-white/5 p-4 rounded-lg">
                            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed h-[300px] overflow-y-auto custom-scrollbar">
                                {coverLetter}
                            </pre>
                            <button onClick={() => copyToClipboard(coverLetter)} className="mt-4 text-xs text-purple-400 hover:text-white">Copy to Clipboard</button>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                            Click 'Draft Letter' to generate a tailored cover letter based on your resume and target job.
                        </div>
                    )}
                </div>

                {/* Interview Prep */}
                <div className="glass-card p-6 animate-fade-in border-t border-green-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Mock Interview Simulator</h3>
                        <button
                            onClick={handleGenerateInterview}
                            disabled={isGeneratingInterview}
                            className={`text-sm px-4 py-2 rounded-lg transition-colors ${isGeneratingInterview ? 'bg-green-900/50' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isGeneratingInterview ? 'Preparing...' : 'Start Session'}
                        </button>
                    </div>

                    <div className="h-[300px] overflow-y-auto custom-scrollbar">
                        {interviewQuestions ? (
                            <div className="space-y-4">
                                {interviewQuestions.map((q, i) => (
                                    <div key={i} className="bg-white/5 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setActiveQuestionIndex(activeQuestionIndex === i ? null : i)}
                                            className="w-full text-left p-4 hover:bg-white/5 transition-colors flex justify-between items-start gap-4"
                                        >
                                            <div>
                                                <span className={`text-xs px-2 py-1 rounded full mb-2 inline-block ${q.type === 'Technical' ? 'bg-blue-900/30 text-blue-300' : 'bg-orange-900/30 text-orange-300'}`}>{q.type}</span>
                                                <p className="text-gray-200 text-sm font-medium">{q.question}</p>
                                            </div>
                                            <span className="text-gray-500">{activeQuestionIndex === i ? '−' : '+'}</span>
                                        </button>

                                        {activeQuestionIndex === i && (
                                            <div className="p-4 pt-0 bg-black/20 text-sm border-t border-white/5">
                                                <p className="text-gray-400 mb-2"><span className="text-gray-300 font-bold">Context:</span> {q.context}</p>
                                                <p className="text-green-400"><span className="font-bold">Pro Tip:</span> {q.answer_tip}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                                Generate tough questions based on your specific resume gaps.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Resume Editor Section */}
            <div className="glass-card p-8 animate-fade-in border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">AI-Assisted Editor</h3>
                        <p className="text-gray-400 text-sm">Review and polish your resume content.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAutoRewrite}
                            disabled={isRewriting}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isRewriting ? 'bg-purple-900/50 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 shadow-lg shadow-purple-900/50'}`}
                        >
                            {isRewriting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Polishing...
                                </>
                            ) : (
                                <>
                                    <span>✨</span> Auto-Polish
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleDownloadResume}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                            </svg>
                            Download
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full h-[500px] bg-black/30 border border-gray-700/50 rounded-lg p-8 text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors font-mono text-sm leading-relaxed resize-y custom-scrollbar shadow-inner"
                        placeholder="Resume text will appear here..."
                    ></textarea>
                    {isRewriting && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                            <div className="text-center">
                                <p className="text-purple-300 font-medium animate-pulse">AI is rewriting your resume...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
