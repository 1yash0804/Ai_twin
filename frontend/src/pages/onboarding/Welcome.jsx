import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <nav className="flex items-center justify-between">
                    <div className="text-2xl font-bold">AI Twin</div>
                    <button
                        onClick={() => navigate('/login')}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Login
                    </button>
                </nav>

                <section className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                            Personal AI Companion
                        </p>
                        <h1 className="text-5xl font-bold leading-tight">
                            Your frontend now matches the landing-page feel.
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            Clean white layout, soft blue accents, and lightweight cards so onboarding and dashboard feel like one product.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/onboarding/signup')}
                                className="btn-primary"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => navigate('/onboarding/connect-platform')}
                                className="btn-secondary"
                            >
                                Connect Platform
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-sm">
                        <h2 className="text-xl font-semibold">What AI Twin does</h2>
                        <ul className="mt-5 space-y-4 text-gray-700">
                            <li>✅ Learns your communication style</li>
                            <li>✅ Extracts tasks and deadlines</li>
                            <li>✅ Builds memory from conversations</li>
                            <li>✅ Helps you respond faster across channels</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
