import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div className="min-h-screen flex bg-gradient-to-b from-white via-sky-50 to-white relative">

            {/* Sidebar */}
            <aside className={`relative z-10 ${sidebarOpen ? 'w-64' : 'w-20'} backdrop-blur-xl bg-white/90 border-r border-gray-200 transition-all duration-300 flex flex-col`}>

                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-gray-900">AT</span>
                        </div>
                        {sidebarOpen && <span className="text-xl font-bold text-gray-900">AI Twin</span>}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'playground'
                                ? 'bg-primary-500/20 text-primary-700 border border-primary-500/30'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                    >
                        <span className="text-xl">{sidebarOpen ? '←' : '→'}</span>
                        {sidebarOpen && <span className="font-medium">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col">

                {/* Header */}
                <header className="backdrop-blur-xl bg-white/80 border-b border-gray-200 p-6 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">AI Playground</h1>
                            <p className="text-gray-600">Test how your AI responds</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-xl bg-primary-500/20 border border-primary-500/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-primary-300 font-medium">85% Match</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-gray-900 font-semibold">
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
                                        ? 'bg-primary-500 text-gray-900'
                                        : 'backdrop-blur-xl bg-white/80 border border-gray-200 text-gray-100'
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
                                <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-2xl p-4">
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
                <div className="backdrop-blur-xl bg-white/80 border-t border-gray-200 p-6 flex-shrink-0">
                    <div className="max-w-3xl mx-auto">

                        {/* Quick Prompts */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            <button
                                onClick={() => setInput('How would you respond to: "Want to grab lunch?"')}
                                className="px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all whitespace-nowrap text-sm"
                            >
                                Test lunch invite
                            </button>
                            <button
                                onClick={() => setInput('Someone asks "What are you up to?"')}
                                className="px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all whitespace-nowrap text-sm"
                            >
                                Casual check-in
                            </button>
                            <button
                                onClick={() => setInput('How would you decline a meeting politely?')}
                                className="px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all whitespace-nowrap text-sm"
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
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-gray-900 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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