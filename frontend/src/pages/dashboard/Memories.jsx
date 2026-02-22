import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

export default function Memories() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const res = await apiClient.get('/me/memories');
                // Transform backend data to UI format
                const formatted = res.data.map(m => ({
                    id: m.id,
                    person: 'AI Twin', // We might need to extract person from text later
                    category: 'General',
                    memory: m.text,
                    source: 'Conversation',
                    date: new Date(m.created_at).toLocaleDateString(),
                    icon: '🧠'
                }));
                setMemories(formatted);
            } catch (error) {
                console.error('Failed to fetch memories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMemories();
    }, []);

    const people = ['all', ...new Set(memories.map(m => m.person))];

    const filteredMemories = memories.filter(m =>
        (selectedPerson === 'all' || m.person === selectedPerson) &&
        (searchQuery === '' || m.memory.toLowerCase().includes(searchQuery.toLowerCase()) || m.person.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'memories'
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
            <main className="flex-1 relative z-10 overflow-auto">

                {/* Header */}
                <header className="backdrop-blur-xl bg-white/80 border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Memories</h1>
                            <p className="text-gray-600">What your AI remembers about people</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-gray-900 font-medium transition-all">
                                + Add Memory
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-gray-900 font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 max-w-6xl">

                    {loading && (
                        <div className="text-center py-12 text-gray-600">Loading memories...</div>
                    )}

                    {!loading && (
                        <>
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-gray-900">{memories.length}</div>
                                    <div className="text-sm text-gray-600">Total memories</div>
                                </div>
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-gray-900">{people.length - 1}</div>
                                    <div className="text-sm text-gray-600">People tracked</div>
                                </div>
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-gray-900">{new Set(memories.map(m => m.category)).size}</div>
                                    <div className="text-sm text-gray-600">Categories</div>
                                </div>
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-gray-900">3</div>
                                    <div className="text-sm text-gray-600">This week</div>
                                </div>
                            </div>

                            {/* Search & Filters */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search memories..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto">
                                    {people.map((person) => (
                                        <button
                                            key={person}
                                            onClick={() => setSelectedPerson(person)}
                                            className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedPerson === person
                                                ? 'bg-primary-500 text-gray-900'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {person === 'all' ? 'All People' : person}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Memories Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredMemories.map((memory) => (
                                    <div
                                        key={memory.id}
                                        className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6 hover:bg-white/95 transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl">{memory.icon}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div>
                                                        <h3 className="text-gray-900 font-semibold mb-1">{memory.person}</h3>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                                            {memory.category}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">{memory.date}</span>
                                                </div>

                                                <p className="text-gray-700 mb-2">
                                                    {memory.memory}
                                                </p>

                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>From: {memory.source}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredMemories.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-gray-600">No memories found</p>
                                </div>
                            )}
                        </>
                    )}

                </div>

            </main>

        </div>
    );
}