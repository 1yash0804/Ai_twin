import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function SetRules() {
    const navigate = useNavigate();

    // State for configuration
    const [casualLevel, setCasualLevel] = useState(50);
    const [msgLength, setMsgLength] = useState('balanced'); // short, balanced, long
    const [emojiUsage, setEmojiUsage] = useState(true);
    const [delay, setDelay] = useState(false); // human-like delay

    // Mock Preview Text based on settings
    const [previewText, setPreviewText] = useState('');

    useEffect(() => {
        // Simple logic to simulate how the AI changes based on the slider
        if (casualLevel < 30) {
            setPreviewText("I received your message. I'll take a look at the documents and get back to you shortly.");
        } else if (casualLevel < 70) {
            setPreviewText("Got the msg! I'll check the docs and let you know in a bit 👍");
        } else {
            setPreviewText("yoo got it, finna check those docs n lyk rn fr 💀");
        }
    }, [casualLevel]);

    const handleLaunch = async () => {
        // Simulate saving settings
        await new Promise(r => setTimeout(r, 1000));
        navigate('/dashboard'); // The final destination!
    };

    return (
        <div className="min-h-screen flex bg-black relative">

            {/* Matrix Background - Shift to Blue/Purple for "Intelligence" */}
            <div className="absolute inset-0">
                <LetterGlitch
                    glitchColors={['#2c0a3d', '#8b5cf6', '#a78bfa']}
                    glitchSpeed={90}
                    outerVignette={true}
                    smooth={true}
                />
            </div>

            {/* Left Side - Preview */}
            <div className="hidden lg:flex lg:w-1/2 relative p-12">
                <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-3xl p-10 flex flex-col justify-center w-full shadow-2xl relative overflow-hidden">

                    {/* Decorative Background Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white">
                                Live Preview
                            </h2>
                            <p className="text-gray-400">
                                See how your Twin responds in real-time.
                            </p>
                        </div>

                        {/* Mock Phone UI */}
                        <div className="w-full max-w-sm mx-auto bg-black border border-gray-800 rounded-3xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                                <div>
                                    <div className="text-white font-medium text-sm">AI Twin</div>
                                    <div className="text-xs text-primary-400">Typing...</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Received Message */}
                                <div className="flex justify-start">
                                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 text-sm max-w-[80%]">
                                        Did you get the files I sent?
                                    </div>
                                </div>

                                {/* AI Response (Animated) */}
                                <div className="flex justify-end">
                                    <div className="bg-primary-600 text-white rounded-2xl rounded-tr-none px-4 py-2 text-sm max-w-[80%] transition-all duration-300 shadow-lg shadow-primary-500/20">
                                        {previewText}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                This is just a simulation. Your AI learns from your actual data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Controls */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-xl space-y-8 backdrop-blur-xl bg-black/60 p-10 rounded-2xl border border-white/10 shadow-2xl">

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Step 4 of 5</span>
                            <span>80%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full w-4/5 transition-all"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Fine-tune your Twin
                        </h2>
                        <p className="text-gray-400">
                            Adjust how your AI communicates with others.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="space-y-8 py-4">

                        {/* 1. Casualness Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-white font-medium">
                                <label>Tone</label>
                                <span className="text-primary-400">
                                    {casualLevel < 30 ? 'Professional' : casualLevel < 70 ? 'Casual' : 'Unfiltered'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={casualLevel}
                                onChange={(e) => setCasualLevel(e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 px-1">
                                <span>Corporate</span>
                                <span>Friendly</span>
                                <span>Gen Z</span>
                            </div>
                        </div>

                        {/* 2. Message Length */}
                        <div className="space-y-3">
                            <label className="text-white font-medium">Response Length</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['short', 'balanced', 'long'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setMsgLength(type)}
                                        className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${msgLength === type
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Toggles */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <div className="text-white font-medium">Use Emojis</div>
                                    <div className="text-xs text-gray-400">Add flavor to messages 👻</div>
                                </div>
                                <button
                                    onClick={() => setEmojiUsage(!emojiUsage)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${emojiUsage ? 'bg-primary-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${emojiUsage ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div>
                                    <div className="text-white font-medium">Human-like Delay</div>
                                    <div className="text-xs text-gray-400">Wait before responding</div>
                                </div>
                                <button
                                    onClick={() => setDelay(!delay)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${delay ? 'bg-primary-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${delay ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Launch Button */}
                    <button
                        onClick={handleLaunch}
                        className="w-full px-6 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-xl shadow-white/10"
                    >
                        Finish & Launch Twin 🚀
                    </button>

                </div>
            </div>

        </div>
    );
}