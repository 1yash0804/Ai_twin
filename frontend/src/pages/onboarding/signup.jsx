import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Remove the alert if you want a smoother experience
        // alert('Account created successfully!'); 

        setLoading(false);

        // ➤ NAVIGATE TO THE NEXT STEP
        navigate('/onboarding/connect-platform');
    };

    return (
        <div className="min-h-screen flex bg-black relative">

            {/* Matrix Background - Full Screen */}
            <div className="absolute inset-0">
                <LetterGlitch
                    glitchColors={['#0a3d2c', '#22c55e', '#4ade80']}
                    glitchSpeed={80}
                    outerVignette={true}
                    smooth={true}
                />
            </div>

            {/* Left Side - Branding (Now in Card) */}
            <div className="hidden lg:flex lg:w-1/2 relative p-12">

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-3xl p-10 flex flex-col justify-center w-full shadow-2xl">

                    {/* Logo */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <span className="text-xl font-bold">AT</span>
                            </div>
                            <span className="text-2xl font-bold">AI Twin</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-white leading-tight">
                                Your digital twin, <br />trained on you
                            </h1>
                            <p className="text-xl text-gray-300">
                                5 minutes to setup. Lifetime of saved time.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-6">
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white">85%</div>
                                <div className="text-sm text-gray-400">Personality match</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white">2hr</div>
                                <div className="text-sm text-gray-400">Saved daily</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold text-white">200+</div>
                                <div className="text-sm text-gray-400">Active users</div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Continuous learning from your messages</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>Automatic task and memory extraction</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>End-to-end encrypted</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md space-y-8 backdrop-blur-xl bg-black/60 p-10 rounded-2xl border border-white/10 shadow-2xl">

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
                            <span>Step 1 of 5</span>
                            <span>20%</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full w-1/5 transition-all"></div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Create your account
                        </h2>
                        <p className="text-gray-400">
                            Tell us about yourself
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Full name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:bg-white/10 outline-none transition-all"
                                placeholder="Yash Singh"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:bg-white/10 outline-none transition-all"
                                placeholder="yash@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:bg-white/10 outline-none transition-all"
                                placeholder="Minimum 8 characters"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Continue'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative pt-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors text-white"
                                onClick={() => alert('Google OAuth - Coming soon!')}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Google</span>
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors text-white"
                                onClick={() => alert('Apple OAuth - Coming soon!')}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <span>Apple</span>
                            </button>
                        </div>

                    </form>

                    {/* Sign In Link */}
                    <div className="text-center pt-4">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center pt-2">
                        By continuing, you agree to our{' '}
                        <a href="/terms" className="underline hover:text-gray-400">Terms</a>
                        {' '}and{' '}
                        <a href="/privacy" className="underline hover:text-gray-400">Privacy Policy</a>
                    </p>

                </div>
            </div>

        </div>
    );
}