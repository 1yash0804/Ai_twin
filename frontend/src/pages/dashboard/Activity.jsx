import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';
import apiClient from '../../api/client';

export default function Activity() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await apiClient.get('/me/activities');
                // Transform backend data to UI format
                const formatted = res.data.map(a => {
                    if (a.type === 'memory') {
                        return {
                            id: a.id,
                            type: 'memory',
                            time: new Date(a.created_at).toLocaleString(),
                            from: a.source,
                            message: `Created memory: "${a.text}"`,
                            extracted: a.text,
                            category: 'Memory',
                            icon: '💭'
                        };
                    } else if (a.type === 'task') {
                        return {
                            id: a.id,
                            type: 'task',
                            time: new Date(a.created_at).toLocaleString(),
                            from: a.source,
                            message: `New task: "${a.text}"`,
                            extracted: a.text,
                            addedTo: 'Tasks',
                            icon: '✅'
                        };
                    }
                    return null;
                }).filter(Boolean);
                setActivities(formatted);
            } catch (error) {
                console.error('Failed to fetch activity:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(a => a.type === filter);

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'activity'
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
                            <h1 className="text-3xl font-bold text-white mb-1">Activity Feed</h1>
                            <p className="text-gray-400">Everything your AI has done</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                Export
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 max-w-5xl">

                    {/* Filters */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all'
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            All Activity
                        </button>
                        <button
                            onClick={() => setFilter('response')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'response'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Responses
                        </button>
                        <button
                            onClick={() => setFilter('task')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'task'
                                ? 'bg-green-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Tasks
                        </button>
                        <button
                            onClick={() => setFilter('memory')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'memory'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Memories
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-12 text-gray-400">Loading activity...</div>
                    )}

                    {/* Activity List */}
                    {!loading && (
                        <div className="space-y-4">
                            {filteredActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-black/50 transition-all"
                                >
                                    <div className="flex items-start gap-4">

                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'response' ? 'bg-blue-500/20' :
                                            activity.type === 'task' ? 'bg-green-500/20' :
                                                'bg-purple-500/20'
                                            }`}>
                                            <span className="text-2xl">{activity.icon}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">

                                            {/* Header */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-white font-semibold">{activity.from}</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-400">{activity.time}</span>
                                            </div>

                                            {/* Message */}
                                            <div className="space-y-3">
                                                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                                    <p className="text-sm text-gray-300">"{activity.message}"</p>
                                                </div>

                                                {/* Task */}
                                                {activity.type === 'task' && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                                            <p className="text-sm text-green-300">✅ {activity.extracted}</p>
                                                        </div>
                                                        <span className="text-xs text-gray-500">→ Added to {activity.addedTo}</span>
                                                    </div>
                                                )}

                                                {/* Memory */}
                                                {activity.type === 'memory' && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                                            <p className="text-sm text-purple-300">💭 {activity.extracted}</p>
                                                        </div>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                                            {activity.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 mt-4">
                                                <button className="text-xs text-gray-400 hover:text-white transition-colors">
                                                    View conversation
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredActivities.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-gray-400">No activity found</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}