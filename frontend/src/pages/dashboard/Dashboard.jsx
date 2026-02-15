import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

export default function Dashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock data (will come from backend later)
    const stats = {
        messagesResponded: 12,
        tasksExtracted: 3,
        memoriesCreated: 1
    };

    const recentActivities = [
        {
            id: 1,
            type: 'response',
            time: '2 mins ago',
            from: 'Unknown Number',
            message: 'Hey, is this Yash?',
            aiResponse: 'Sorry, who is this? 🤔',
            icon: '✉️',
            color: 'blue'
        },
        {
            id: 2,
            type: 'task',
            time: '10 mins ago',
            from: 'Work Group',
            message: 'Team meeting at 2pm today',
            extracted: 'Team meeting @ 2pm today',
            icon: '✅',
            color: 'green'
        },
        {
            id: 3,
            type: 'response',
            time: '1 hour ago',
            from: 'Sarah',
            message: 'Coffee at 3pm tomorrow?',
            aiResponse: 'Sounds good! See you then 😊',
            icon: '✉️',
            color: 'blue'
        }
    ];

    const upcomingTasks = [
        { id: 1, title: 'Team meeting @ 2pm today', completed: false },
        { id: 2, title: 'Coffee with Sarah @ 3pm tomorrow', completed: false },
        { id: 3, title: 'Call mom this weekend', completed: false }
    ];

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

                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-white">AT</span>
                        </div>
                        {sidebarOpen && (
                            <span className="text-xl font-bold text-white">AI Twin</span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'overview'
                                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="font-medium">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Collapse Button */}
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
                            <h1 className="text-3xl font-bold text-white mb-1">
                                Good afternoon, Yash
                            </h1>
                            <p className="text-gray-400">
                                Your AI Twin is running smoothly
                            </p>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                            </button>

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Messages Responded */}
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-black/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-bold text-white">{stats.messagesResponded}</div>
                                <div className="text-sm text-gray-400">Messages responded</div>
                            </div>
                        </div>

                        {/* Tasks Extracted */}
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-black/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-bold text-white">{stats.tasksExtracted}</div>
                                <div className="text-sm text-gray-400">Tasks extracted</div>
                            </div>
                        </div>

                        {/* Memories Created */}
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-black/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <span className="text-2xl">💭</span>
                                </div>
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-bold text-white">{stats.memoriesCreated}</div>
                                <div className="text-sm text-gray-400">New memories</div>
                            </div>
                        </div>

                    </div>

                    {/* Main Grid - Activity + Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Latest Activity */}
                        <div className="lg:col-span-2 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Latest Activity</h2>
                                <button
                                    onClick={() => navigate('/dashboard/activity')}
                                    className="text-sm text-primary-400 hover:text-primary-300 font-medium"
                                >
                                    View all →
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-${activity.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                                                <span className="text-xl">{activity.icon}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white font-medium">{activity.from}</span>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                                </div>

                                                {activity.type === 'response' ? (
                                                    <>
                                                        <p className="text-sm text-gray-400 mb-2">"{activity.message}"</p>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-xs text-gray-500">AI:</span>
                                                            <p className="text-sm text-primary-300">"{activity.aiResponse}"</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-sm text-gray-400 mb-2">"{activity.message}"</p>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-300">
                                                                Task: {activity.extracted}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Tasks */}
                        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Upcoming</h2>
                                <button
                                    onClick={() => navigate('/dashboard/tasks')}
                                    className="text-sm text-primary-400 hover:text-primary-300 font-medium"
                                >
                                    View all →
                                </button>
                            </div>

                            <div className="space-y-3">
                                {upcomingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group cursor-pointer"
                                    >
                                        <button className="w-5 h-5 rounded border-2 border-gray-600 hover:border-primary-500 transition-colors flex-shrink-0 mt-0.5">
                                            {task.completed && (
                                                <svg className="w-full h-full text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                                            {task.title}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                                + Add task manually
                            </button>
                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/dashboard/playground')}
                            className="p-6 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl hover:bg-black/50 hover:border-primary-500/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-semibold mb-1">Chat with AI Twin</div>
                                    <div className="text-sm text-gray-400">Test responses</div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/settings')}
                            className="p-6 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl hover:bg-black/50 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">⚙️</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-semibold mb-1">Settings</div>
                                    <div className="text-sm text-gray-400">Manage rules</div>
                                </div>
                            </div>
                        </button>

                        <button className="p-6 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl hover:bg-black/50 hover:border-white/20 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-semibold mb-1">Analytics</div>
                                    <div className="text-sm text-gray-400">View insights</div>
                                </div>
                            </div>
                        </button>
                    </div>

                </div>

            </main>

        </div>
    );
}