import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function AhaPreview() {
    const navigate = useNavigate();

    const features = [
        {
            step: '1',
            icon: '💬',
            title: 'Someone texts you',
            description: '"Coffee at 3pm tomorrow?"',
            color: 'from-blue-500 to-blue-600'
        },
        {
            step: '2',
            icon: '🤖',
            title: 'Your AI responds',
            description: '"Sounds good! See you then 😊"',
            color: 'from-primary-500 to-primary-600'
        },
        {
            step: '3',
            icon: '✅',
            title: 'Task extracted',
            description: 'Coffee @ 3pm Tue → Calendar',
            color: 'from-purple-500 to-purple-600'
        },
        {
            step: '4',
            icon: '💭',
            title: 'Memory saved',
            description: 'Mike likes coffee meetings',
            color: 'from-pink-500 to-pink-600'
        }
    ];

    return (
        <div className="min-h-screen flex bg-black relative overflow-hidden">

            {/* Matrix Background */}
            <div className="absolute inset-0">
                <LetterGlitch
                    glitchColors={['#0a3d2c', '#22c55e', '#4ade80']}
                    glitchSpeed={80}
                    outerVignette={true}
                    smooth={true}
                />
            </div>

            {/* Centered Content */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-4xl space-y-8 backdrop-blur-xl bg-black/60 p-12 rounded-3xl border border-white/10 shadow-2xl">

                    {/* Success Icon */}
                    <div className="text-center">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-primary-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-4">
                            You're all set! 🎉
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Your AI Twin is ready. Here's what happens next:
                        </p>
                    </div>

                    {/* Flow Visualization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
                        {features.map((feature, index) => (
                            <div key={index} className="relative">
                                {/* Arrow between cards (desktop) */}
                                {index < features.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}

                                {/* Card */}
                                <div className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group h-full">
                                    {/* Step Number */}
                                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                                        {feature.step}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-white font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-white/10">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">2 hrs</div>
                            <div className="text-sm text-gray-400">Saved daily</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">85%</div>
                            <div className="text-sm text-gray-400">Personality match</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">24/7</div>
                            <div className="text-sm text-gray-400">Always on</div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                            <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-gray-300">
                                <p className="font-semibold text-white mb-1">You're in control</p>
                                <p>You'll get notified whenever your AI responds. Review and edit responses anytime in your dashboard.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-gray-300">
                                <p className="font-semibold text-white mb-1">Continuous learning</p>
                                <p>Your AI gets smarter with every conversation, learning your evolving style and preferences.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-4 pt-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full px-8 py-4 bg-white text-black text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                        >
                            Go to Dashboard →
                        </button>

                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                            <button
                                onClick={() => navigate('/tutorial')}
                                className="hover:text-white transition-colors"
                            >
                                Quick tutorial
                            </button>
                            <span>•</span>
                            <button
                                onClick={() => navigate('/settings')}
                                className="hover:text-white transition-colors"
                            >
                                Settings
                            </button>
                            <span>•</span>
                            <button
                                onClick={() => navigate('/help')}
                                className="hover:text-white transition-colors"
                            >
                                Help center
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}