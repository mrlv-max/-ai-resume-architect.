import React from 'react';

const OptimizationSuggestions = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) {
        return <div className="text-gray-400">No specific suggestions found.</div>;
    }

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div className="space-y-4">
            {suggestions.map((item, index) => (
                <div
                    key={index}
                    className="glass-card p-4 hover:bg-white/5 transition-colors border-l-4 border-l-purple-500"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                            {item.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}>
                            {item.priority} Priority
                        </span>
                    </div>

                    <h4 className="font-semibold text-white mb-2">{item.suggestion}</h4>

                    {item.current && (
                        <div className="mb-2 text-sm text-gray-400">
                            <span className="text-red-400 font-medium">Current:</span> {item.current}
                        </div>
                    )}

                    {item.improved && (
                        <div className="text-sm bg-green-900/10 p-2 rounded border border-green-500/10">
                            <span className="text-green-400 font-medium">Try this:</span> <span className="text-gray-300">{item.improved}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OptimizationSuggestions;
