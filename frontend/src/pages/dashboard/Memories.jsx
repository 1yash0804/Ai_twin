import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function Memories() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPerson, setSelectedPerson] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const memories = [
        {
            id: 1,
            person: 'Sarah',
            category: 'Preferences',
            memory: 'Prefers oat milk in coffee',
            source: 'Coffee chat',
            date: '1 hour ago',
            icon: '☕'
        },
        {
            id: 2,
            person: 'Mike',
            category: 'Important Dates',
            memory: 'Birthday is March 15th',
            source: 'Conversation',
            date: '2 days ago',
            icon: '🎂'
        },
        {
            id: 3,
            person: 'Sarah',
            category: 'Interests',
            memory: 'Loves hiking and outdoor activities',
            source: 'Weekend plans chat',
            date: '3 days ago',
            icon: '⛰️'
        },
        {
            id: 4,
            person: 'Mom',
            category: 'Health',
            memory: 'Allergic to peanuts',
            source: 'Family dinner discussion',
            date: '1 week ago',
            icon: '🥜'
        },
        {
            id: 5,
            person: 'Mike',
            category: 'Work',
            memory: 'Working on new project launch',
            source: 'Work chat',
            date: '1 week ago',
            icon: '💼'
        },
        {
            id: 6,
            person: 'Sarah',
            category: 'Preferences',
            memory: 'Vegetarian diet',
            source: 'Restaurant planning',
            date: '2 weeks ago',
            icon: '🥗'
        }
    ];

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'memories'
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
            <main className="flex-1 relative z-10 overflow-auto">

                {/* Header */}
                <header className="backdrop-blur-xl bg-black/60 border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Memories</h1>
                            <p className="text-gray-400">What your AI remembers about people</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all">
                                + Add Memory
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 max-w-6xl">

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-white">{memories.length}</div>
                            <div className="text-sm text-gray-400">Total memories</div>
                        </div>
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-white">{people.length - 1}</div>
                            <div className="text-sm text-gray-400">People tracked</div>
                        </div>
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-white">{new Set(memories.map(m => m.category)).size}</div>
                            <div className="text-sm text-gray-400">Categories</div>
                        </div>
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-bold text-white">3</div>
                            <div className="text-sm text-gray-400">This week</div>
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
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {people.map((person) => (
                                <button
                                    key={person}
                                    onClick={() => setSelectedPerson(person)}
                                    className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedPerson === person
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
                                className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-black/50 transition-all group"
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
                                                <h3 className="text-white font-semibold mb-1">{memory.person}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                                    {memory.category}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">{memory.date}</span>
                                        </div>

                                        <p className="text-gray-300 mb-2">
                                            {memory.memory}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>From: {memory.source}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
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
                            <p className="text-gray-400">No memories found</p>
                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}