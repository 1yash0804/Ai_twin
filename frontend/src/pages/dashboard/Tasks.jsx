import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';
import apiClient from '../../api/client';

export default function Tasks() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showAddTask, setShowAddTask] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await apiClient.get('/me/tasks');
                const formatted = res.data.map(t => ({
                    id: t.id,
                    title: t.description,
                    completed: t.status === 'completed',
                    dueDate: t.due_date || 'No date',
                    priority: 'medium', // Default for now
                    source: t.source || 'Unknown'
                }));
                setTasks(formatted);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const toggleTask = (id) => {
        // Optimistic update
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
        // In real app, we would call API here to update status
    };

    const filteredTasks = filter === 'all'
        ? tasks
        : filter === 'completed'
            ? tasks.filter(t => t.completed)
            : tasks.filter(t => !t.completed);

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'tasks'
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
                            <h1 className="text-3xl font-bold text-white mb-1">Tasks</h1>
                            <p className="text-gray-400">Extracted from your messages</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowAddTask(true)}
                                className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all"
                            >
                                + Add Task
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 max-w-4xl">

                    {loading && (
                        <div className="text-center py-12 text-gray-400">Loading tasks...</div>
                    )}

                    {!loading && (
                        <>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-white">{tasks.filter(t => !t.completed).length}</div>
                                    <div className="text-sm text-gray-400">Active tasks</div>
                                </div>
                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-white">{tasks.filter(t => t.completed).length}</div>
                                    <div className="text-sm text-gray-400">Completed</div>
                                </div>
                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4">
                                    <div className="text-2xl font-bold text-white">{tasks.filter(t => t.dueDate === 'Today').length}</div>
                                    <div className="text-sm text-gray-400">Due today</div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'active' ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setFilter('completed')}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Completed
                                </button>
                            </div>

                            {/* Tasks List */}
                            <div className="space-y-3">
                                {filteredTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-xl p-4 hover:bg-black/50 transition-all group"
                                    >
                                        <div className="flex items-start gap-4">

                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleTask(task.id)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${task.completed
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-600 hover:border-primary-500'
                                                    }`}
                                            >
                                                {task.completed && (
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                                        {task.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {task.priority === 'high' && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">High</span>
                                                        )}
                                                        {task.priority === 'medium' && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">Medium</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span>📅 {task.dueDate}</span>
                                                    <span>•</span>
                                                    <span>From: {task.source}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                                <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Task Modal (simplified) */}
                            {showAddTask && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl p-6 max-w-md w-full">
                                        <h3 className="text-xl font-bold text-white mb-4">Add Task</h3>
                                        <input
                                            type="text"
                                            placeholder="Task title..."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 mb-4 outline-none focus:border-primary-500"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowAddTask(false)}
                                                className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => setShowAddTask(false)}
                                                className="flex-1 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>

            </main>

        </div>
    );
}