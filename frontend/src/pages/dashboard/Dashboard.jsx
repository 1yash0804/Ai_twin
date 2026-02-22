import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    CheckSquare,
    Brain,
    Bot,
    Settings,
    Bell,
    BarChart3,
    ArrowRight,
} from 'lucide-react';

import LetterGlitch from '../../components/LetterGlitch';
import apiClient from '../../api/client';

export default function Dashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        messagesResponded: 0,
        tasksExtracted: 0,
        memoriesCreated: 0,
    });
    const [loraStatus, setLoraStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const recentActivities = [
        {
            id: 1,
            type: 'response',
            time: '2 mins ago',
            from: 'Unknown Number',
            message: 'Hey, is this Yash?',
            aiResponse: 'Sorry, who is this?',
        },
        {
            id: 2,
            type: 'task',
            time: '10 mins ago',
            from: 'Work Group',
            message: 'Team meeting at 2pm today',
            extracted: 'Team meeting @ 2pm today',
        },
        {
            id: 3,
            type: 'response',
            time: '1 hour ago',
            from: 'Sarah',
            message: 'Coffee at 3pm tomorrow?',
            aiResponse: 'Sounds good, see you then.',
        },
    ];

    const upcomingTasks = [
        { id: 1, title: 'Team meeting @ 2pm today', completed: false },
        { id: 2, title: 'Coffee with Sarah @ 3pm tomorrow', completed: false },
        { id: 3, title: 'Call mom this weekend', completed: false },
    ];

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'activity', label: 'Activity', icon: MessageSquare, path: '/dashboard/activity' },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/dashboard/tasks' },
        { id: 'memories', label: 'Memories', icon: Brain, path: '/dashboard/memories' },
        { id: 'playground', label: 'AI Playground', icon: Bot, path: '/dashboard/playground' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ];

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                const [statsRes, loraRes] = await Promise.all([
                    apiClient.get('/me/stats'),
                    apiClient.get('/me/lora'),
                ]);

                if (!isMounted) return;

                setStats({
                    messagesResponded: statsRes.data.messages_responded ?? 0,
                    tasksExtracted: statsRes.data.tasks_extracted ?? 0,
                    memoriesCreated: statsRes.data.memories_created ?? 0,
                });
                setLoraStatus(loraRes.data);
            } catch (err) {
                if (!isMounted) return;
                setError('Unable to load dashboard data.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const getActivityMeta = (type) => {
        if (type === 'task') {
            return {
                icon: CheckSquare,
                bgClass: 'bg-emerald-500/10 border-emerald-500/20',
                iconClass: 'text-emerald-400',
            };
        }
        if (type === 'response') {
            return {
                icon: MessageSquare,
                bgClass: 'bg-sky-500/10 border-sky-500/20',
                iconClass: 'text-sky-400',
            };
        }
        return {
            icon: Brain,
            bgClass: 'bg-purple-500/10 border-purple-500/20',
            iconClass: 'text-purple-400',
        };
    };

    return (
        <div className="min-h-screen flex bg-black relative">

            {/* Background */}
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">AT</span>
                        </div>
                        {sidebarOpen && (
                            <span className="text-xl font-bold text-white">AI Twin</span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'overview'
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {sidebarOpen && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Collapse */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                        <span>{sidebarOpen ? '←' : '→'}</span>
                        {sidebarOpen && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 overflow-auto">

                {/* Header */}
                <header className="backdrop-blur-xl bg-black/60 border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Good afternoon, Yash
                            </h1>
                            <p className="text-gray-400">
                                Your AI Twin is running smoothly
                            </p>
                        </div>

                        <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10">
                            <Bell className="w-5 h-5 text-gray-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            icon={MessageSquare}
                            label="Messages responded"
                            value={loading ? '–' : stats.messagesResponded}
                        />
                        <StatCard
                            icon={CheckSquare}
                            label="Tasks extracted"
                            value={loading ? '–' : stats.tasksExtracted}
                        />
                        <StatCard
                            icon={Brain}
                            label="New memories"
                            value={loading ? '–' : stats.memoriesCreated}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}

/* Small reusable stat card */
function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-400">Today</span>
            </div>
            <div className="text-4xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    );
}
