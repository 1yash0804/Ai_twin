import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function UploadChats() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        // Simulate upload and processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        setUploading(false);
        navigate('/onboarding/set-rules');
    };

    const handleSkip = () => {
        navigate('/onboarding/set-rules');
    };

    return (
        <div className="min-h-screen flex bg-black relative">

            {/* Matrix Background */}
            <div className="absolute inset-0">
                <LetterGlitch
                    glitchColors={['#0a3d2c', '#22c55e', '#4ade80']}
                    glitchSpeed={80}
                    outerVignette={true}
                    smooth={true}
                />
            </div>

            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 relative p-12">
                <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-3xl p-10 flex flex-col justify-center w-full shadow-2xl">

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-white mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <span className="text-xl font-bold">AT</span>
                            </div>
                            <span className="text-2xl font-bold">AI Twin</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white leading-tight">
                                Teach your AI how you text
                            </h1>
                            <p className="text-xl text-gray-300">
                                Upload your chat history so your AI can learn your unique style, tone, and personality.
                            </p>
                        </div>

                        <div className="space-y-4 pt-8">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <h3 className="text-white font-semibold mb-2">How to export chats:</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <p><span className="text-primary-400 font-semibold">WhatsApp:</span> Settings → Chats → Export Chat → Without Media</p>
                                    <p><span className="text-blue-400 font-semibold">Telegram:</span> Settings → Advanced → Export Chat History</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-white font-semibold">Your data is safe</p>
                                    <p className="text-gray-400 text-sm">Encrypted and never shared. Deleted after training.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Side - Upload */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-2xl space-y-8 backdrop-blur-xl bg-black/60 p-10 rounded-2xl border border-white/10 shadow-2xl">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </button>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Step 3 of 5</span>
                            <span>60%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full w-3/5 transition-all"></div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Upload your chat history
                        </h2>
                        <p className="text-gray-400">
                            The more messages, the better your AI learns
                        </p>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-white/20 bg-white/5 hover:border-white/30'
                            }`}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            accept=".txt,.json,.zip"
                            className="hidden"
                        />

                        {file ? (
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-xl bg-primary-500/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{file.name}</p>
                                    <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                                >
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-xl bg-white/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <label
                                        htmlFor="file-upload"
                                        className="text-primary-400 hover:text-primary-300 font-semibold cursor-pointer"
                                    >
                                        Click to upload
                                    </label>
                                    <span className="text-gray-400"> or drag and drop</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    WhatsApp (.txt), Telegram (.json), or .zip files
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Processing State */}
                    {uploading && (
                        <div className="p-6 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                            <div className="flex items-center gap-4">
                                <svg className="animate-spin h-6 w-6 text-primary-400" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div className="flex-1">
                                    <p className="text-white font-semibold">Training your AI...</p>
                                    <p className="text-gray-400 text-sm">Analyzing your messaging style and personality</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSkip}
                            className="flex-1 px-6 py-3.5 bg-white/10 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                        >
                            Skip for now
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-1 px-6 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Processing...' : 'Continue'}
                        </button>
                    </div>

                    {/* Help Text */}
                    <p className="text-xs text-gray-500 text-center">
                        Need help exporting? <a href="#" className="text-primary-400 hover:underline">Watch tutorial</a>
                    </p>

                </div>
            </div>

        </div>
    );
}