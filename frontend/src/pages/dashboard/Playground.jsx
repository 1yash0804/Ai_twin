import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';
import apiClient from '../../api/client';

export default function Playground() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Hey! I\'m your AI Twin. Try asking me something or give me a scenario to respond to!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await apiClient.chat({
                query: input,
                modelType: 'general'
            });

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: res.response
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                text: "Sorry, I'm having trouble connecting to my brain right now."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: '📊', path: '/dashboard' },
        { id: 'activity', label: 'Activity', icon: '💬', path: '/dashboard/activity' },
        { id: 'tasks', label: 'Tasks', icon: '✅', path: '/dashboard/tasks' },
        { id: 'memories', label: 'Memories', icon: '💭', path: '/dashboard/memories' },
        { id: 'playground', label: 'AI Playground', icon: '🤖', path: '/dashboard/playground' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/dashboard/settings' }
    ];

    return (
        <div className="min-h-screen flex bg-black relative">

            {/* Matrix Background */}
            <div className="absolute inset-0 opacity-30">
                <LetterGlitch
                    glitchColors={['#0a3d2c', '#22c55e', '#4ade80']}
                    glitchSpeed={100}
                    outerVignette={true}
                    smooth={true}
                />
            </div>

            {/* Sidebar */}
            <aside className={`relative z-10 ${sidebarOpen ? 'w-64' : 'w-20'} backdrop-blur-xl bg-black/80 border-r border-white/10 transition-all duration-300 flex flex-col`}>

                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-white">AT</span>
                        </div>
                        {sidebarOpen && <span className="text-xl font-bold text-white">AI Twin</span>}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'playground'
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                    >
                        <span className="text-xl">{sidebarOpen ? '←' : '→'}</span>
                        {sidebarOpen && <span className="font-medium">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col">

                {/* Header */}
                <header className="backdrop-blur-xl bg-black/60 border-b border-white/10 p-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">AI Playground</h1>
                            <p className="text-gray-400">Test how your AI responds</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-xl bg-primary-500/20 border border-primary-500/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-primary-300 font-medium">85% Match</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-3xl mx-auto space-y-4">

                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-lg ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                                    <div className={`rounded-2xl p-4 ${message.type === 'user'
                                        ? 'bg-primary-500 text-white'
                                        : 'backdrop-blur-xl bg-black/60 border border-white/10 text-gray-100'
                                        }`}>
                                        {message.text}
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 px-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.type === 'user' ? 'You' : 'AI Twin'}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Input Area */}
                <div className="backdrop-blur-xl bg-black/60 border-t border-white/10 p-6 flex-shrink-0">
                    <div className="max-w-3xl mx-auto">

                        {/* Quick Prompts */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            <button
                                onClick={() => setInput('How would you respond to: "Want to grab lunch?"')}
                                className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap text-sm"
                            >
                                Test lunch invite
                            </button>
                            <button
                                onClick={() => setInput('Someone asks "What are you up to?"')}
                                className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap text-sm"
                            >
                                Casual check-in
                            </button>
                            <button
                                onClick={() => setInput('How would you decline a meeting politely?')}
                                className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap text-sm"
                            >
                                Decline meeting
                            </button>
                        </div>

                        {/* Input Box */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a scenario or question..."
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    );
}