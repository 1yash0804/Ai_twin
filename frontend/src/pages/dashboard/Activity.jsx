import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function Activity() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const activities = [
        {
            id: 1,
            type: 'response',
            time: '2 mins ago',
            from: 'Unknown Number (+91-XXX-XXXX)',
            message: 'Hey, is this Yash?',
            aiResponse: 'Sorry, who is this? 🤔',
            status: 'sent',
            icon: '✉️'
        },
        {
            id: 2,
            type: 'task',
            time: '10 mins ago',
            from: 'Work Group Chat',
            message: 'Team meeting at 2pm today',
            extracted: 'Team meeting @ 2pm today',
            addedTo: 'Google Calendar',
            icon: '✅'
        },
        {
            id: 3,
            type: 'response',
            time: '1 hour ago',
            from: 'Sarah',
            message: 'Coffee at 3pm tomorrow?',
            aiResponse: 'Sounds good! See you then 😊',
            status: 'sent',
            icon: '✉️'
        },
        {
            id: 4,
            type: 'memory',
            time: '1 hour ago',
            from: 'Sarah',
            message: 'I prefer oat milk btw',
            extracted: 'Sarah prefers oat milk',
            category: 'Preferences',
            icon: '💭'
        },
        {
            id: 5,
            type: 'response',
            time: '3 hours ago',
            from: 'Mom',
            message: 'Did you eat lunch?',
            aiResponse: 'Yes mom, just had it! 😊',
            status: 'sent',
            icon: '✉️'
        },
        {
            id: 6,
            type: 'task',
            time: '5 hours ago',
            from: 'Mike',
            message: 'Don\'t forget to call me this weekend',
            extracted: 'Call Mike this weekend',
            addedTo: 'Tasks',
            icon: '✅'
        }
    ];

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

                    {/* Activity List */}
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
                                            {activity.type === 'response' && (
                                                <>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                                                        Auto-responded
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                                <p className="text-sm text-gray-300">"{activity.message}"</p>
                                            </div>

                                            {/* Response */}
                                            {activity.type === 'response' && (
                                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-xs text-blue-400 font-semibold">AI:</span>
                                                        <p className="text-sm text-blue-300">"{activity.aiResponse}"</p>
                                                    </div>
                                                </div>
                                            )}

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
                                            {activity.type === 'response' && (
                                                <>
                                                    <span className="text-gray-600">•</span>
                                                    <button className="text-xs text-gray-400 hover:text-white transition-colors">
                                                        Edit response
                                                    </button>
                                                    <span className="text-gray-600">•</span>
                                                    <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                                                        Undo
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </main>

        </div>
    );
}