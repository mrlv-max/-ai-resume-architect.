import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Search, FileText, BarChart3, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import UploadCard from '../components/UploadCard';
import { analyzeResume } from '../services/apiClient';

const HomePage = () => {
    const navigate = useNavigate();
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = (file) => {
        setResumeFile(file);
    };

    const handleAnalyze = async () => {
        if (!resumeFile) {
            setError('Please upload your resume.');
            return;
        }
        if (!jobDescription.trim()) {
            setError('Please paste a job description.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await analyzeResume(resumeFile, jobDescription);
            if (response.success) {
                navigate('/results', { state: { data: response.data, jobDescription } });
            } else {
                setError(response.message || 'Analysis failed. Please try again.');
            }
        } catch (err) {
            setError('Server error. Ensure backend is running.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-32">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto pt-16 px-6 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8">
                    <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">AI Resume Optimizer</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                    Optimize Your Resume for <span className="text-blue-500">Real Jobs</span>, Not Just Keywords.
                </h1>

                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    AI-powered architecture for your personal brand. Stop guessing and start optimizing with enterprise-grade semantic analysis.
                </p>

                {/* Main Action Area */}
                <div className="max-w-2xl mx-auto bg-slate-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-sm mb-16">
                    {!resumeFile ? (
                        <div className="p-8 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                            <UploadCard onUpload={handleUpload} isLoading={isLoading} />
                        </div>
                    ) : (
                        <div className="text-left space-y-4 p-6">
                            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-white/5">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-slate-200 truncate">{resumeFile.name}</span>
                                <button onClick={() => setResumeFile(null)} className="ml-auto text-xs text-slate-500 hover:text-white">Change</button>
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full h-32 bg-slate-950 border border-slate-700/50 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 resize-none transition-all"
                                    placeholder="Paste the Job Description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={isLoading || !jobDescription}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isLoading || !jobDescription ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                            >
                                {isLoading ? 'Architecting...' : 'Run Analysis'}
                            </button>
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        </div>
                    )}
                </div>

                {/* Dashboard Preview Graphic */}
                <div className="relative mx-auto max-w-4xl mb-24 hidden md:block group">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
                    <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
                        {/* Abstract Chart UI */}
                        <div className="w-full h-full opacity-50 flex items-end justify-between px-8 pb-8 gap-2">
                            {[40, 70, 45, 90, 65, 80, 50, 60, 75, 55, 85].map((h, i) => (
                                <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group/bar hover:bg-blue-500/40 transition-colors" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-slate-500 text-sm font-mono tracking-widest">DASHBOARD PREVIEW</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trusted By */}
            <div className="text-center mb-24 border-y border-white/5 py-12 bg-slate-900/20 backdrop-blur-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by candidates applying to</p>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {['ACME Corp', 'Globex', 'Soylent', 'Umbrella', 'Cyberdyne'].map(company => (
                        <span key={company} className="text-xl font-bold text-slate-400 font-serif">{company}</span>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                {[
                    { label: 'Resumes Optimized', value: '10k+' },
                    { label: 'Skill Matches', value: '50k+' },
                    { label: 'User Rating', value: '4.9/5' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/30 p-8 rounded-2xl border border-white/5 text-center hover:bg-slate-800/50 transition-colors">
                        <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Feature Cards */}
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Intelligence Beyond Keywords</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Semantic Analysis</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Understand context and nuance, not just simple keyword matching. We analyze the intent behind the requirements.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Skill Gap Detection</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Instantly visualize missing skills compared to target roles. Get actionable advice on what to learn next.
                        </p>
                        <div className="mt-6 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-2/3"></div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Readiness Score</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Get a comprehensive interview readiness score based on profile strength and job alignment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
