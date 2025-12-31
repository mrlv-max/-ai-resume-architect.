import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, PenTool, User, Settings, Hexagon } from 'lucide-react';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">

        {/* Navigation Header */}
        <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Hexagon className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Brand Architect</span>
            </Link>

            <button className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
              Sign In
            </button>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>

        {/* Bottom Navigation (Mobile/Feature) */}
        <div className="fixed bottom-0 left-0 w-full bg-slate-950 border-t border-white/10 py-3 px-6 z-50 md:hidden">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link to="/" className="flex flex-col items-center gap-1 text-blue-500">
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300">
              <PenTool className="w-5 h-5" />
              <span className="text-[10px] font-medium">Tools</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300">
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Desktop Footer */}
        <footer className="hidden md:block py-12 mt-12 border-t border-white/5 text-center">
          <p className="text-slate-600 text-sm">© 2026 Brand Architect. Enterprise Grade Personal Branding.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
