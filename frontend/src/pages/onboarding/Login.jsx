import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';
import { login } from '../../api/client';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login({
                // Backend expects `username` field; can be email or username
                username: formData.identifier,
                password: formData.password,
            });

            if (result?.access_token) {
                window.localStorage.setItem('ai_twin_token', result.access_token);
                navigate('/dashboard');
            } else {
                setError('Unexpected response from server. Please try again.');
            }
        } catch (err) {
            const detail = err?.response?.data?.detail;
            setError(
                typeof detail === 'string'
                    ? detail
                    : 'Unable to sign in. Please check your credentials and try again.',
            );
        } finally {
            setLoading(false);
        }
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

            {/* Left Side - Branding (reuse onboarding style) */}
            <div className="hidden lg:flex lg:w-1/2 relative p-12">
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
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            Welcome back to your AI Twin
                        </h1>
                        <p className="text-lg text-gray-300">
                            Pick up where you left off. Your AI still remembers your style, tasks, and memories.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
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

                    {/* Heading */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white">
                            Sign in
                        </h2>
                        <p className="text-gray-400">
                            Enter your details to access your dashboard
                        </p>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Email or username
                            </label>
                            <input
                                type="text"
                                value={formData.identifier}
                                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
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
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    {/* Switch to sign up */}
                    <div className="text-center pt-4">
                        <p className="text-gray-400 text-sm">
                            Don&apos;t have an account yet?{' '}
                            <button
                                onClick={() => navigate('/onboarding/signup')}
                                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                            >
                                Create one
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

