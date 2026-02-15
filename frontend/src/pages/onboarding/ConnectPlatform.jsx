import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function ConnectPlatform() {
    const navigate = useNavigate();
    const [selectedPlatform, setSelectedPlatform] = useState(null);

    const platforms = [
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: '💬',
            description: 'Most popular choice',
            badge: 'Recommended',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 'telegram',
            name: 'Telegram',
            icon: '✈️',
            description: 'Great for power users',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: '📷',
            description: 'Coming soon',
            disabled: true,
            color: 'from-pink-500 to-purple-600'
        },
        {
            id: 'sms',
            name: 'SMS',
            icon: '💬',
            description: 'Coming soon',
            disabled: true,
            color: 'from-gray-500 to-gray-600'
        }
    ];

    const handleContinue = () => {
        if (selectedPlatform) {
            navigate('/onboarding/upload-chats');
        }
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

            {/* Left Side - Info */}
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
                                Connect your messaging platform
                            </h1>
                            <p className="text-xl text-gray-300">
                                Choose where you receive most of your messages. You can add more platforms later.
                            </p>
                        </div>

                        <div className="space-y-4 pt-8">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-primary-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-4 h-4 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Secure connection</p>
                                    <p className="text-gray-400 text-sm">End-to-end encrypted, we never store your messages</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-primary-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-4 h-4 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Add more later</p>
                                    <p className="text-gray-400 text-sm">Start with one platform, connect others anytime</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-lg bg-primary-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-4 h-4 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Privacy first</p>
                                    <p className="text-gray-400 text-sm">You control what data to share</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Side - Platform Selection */}
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
                            <span>Step 2 of 5</span>
                            <span>40%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full w-2/5 transition-all"></div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Where do you get messages?
                        </h2>
                        <p className="text-gray-400">
                            Select your primary messaging platform
                        </p>
                    </div>

                    {/* Platform Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {platforms.map((platform) => (
                            <button
                                key={platform.id}
                                onClick={() => !platform.disabled && setSelectedPlatform(platform.id)}
                                disabled={platform.disabled}
                                className={`relative p-6 rounded-xl border-2 transition-all text-left ${platform.disabled
                                        ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                                        : selectedPlatform === platform.id
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                {platform.badge && (
                                    <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold bg-primary-500 text-white rounded-md">
                                        {platform.badge}
                                    </span>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                                        {platform.icon}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-semibold text-white">
                                                {platform.name}
                                            </h3>
                                            {selectedPlatform === platform.id && (
                                                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {platform.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Help Text */}
                    <div className="flex items-start gap-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-gray-300">
                            <p className="font-medium text-white mb-1">Don't worry</p>
                            <p>You can add more platforms later in settings. Start with the one you use most.</p>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!selectedPlatform}
                        className="w-full px-6 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                        Continue
                    </button>

                </div>
            </div>

        </div>
    );
}