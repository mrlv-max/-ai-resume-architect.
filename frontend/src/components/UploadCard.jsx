import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadCard = ({ onUpload, isLoading }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        setError('');
        const uploadedFile = acceptedFiles[0];

        if (uploadedFile) {
            if (uploadedFile.type === 'application/pdf' ||
                uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                uploadedFile.type === 'application/msword') {
                setFile(uploadedFile);
                onUpload(uploadedFile);
            } else {
                setError('Please upload a PDF or DOCX file.');
            }
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc']
        },
        multiple: false
    });

    return (
        <div className="glass-card w-full max-w-lg mx-auto p-4 rounded-xl relative overflow-hidden group">
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 hover:border-purple-400 hover:bg-white/5'}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>

                    <div>
                        {file ? (
                            <p className="font-semibold text-green-400 text-sm">{file.name}</p>
                        ) : (
                            <>
                                <p className="text-base font-medium text-white mb-1">
                                    Drop resume here, or <span className="text-purple-400">browse</span>
                                </p>
                                <p className="text-xs text-gray-400">PDF & DOCX (Max 5MB)</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <p className="mt-2 text-red-400 text-xs animate-fade-in">{error}</p>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-white text-sm font-medium animate-pulse">Analyzing...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadCard;
