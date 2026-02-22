import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

export default function Settings() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('platforms');

    const [settings, setSettings] = useState({
        autoRespondSimple: true,
        autoRespondScheduling: true,
        autoRespondWork: false,
        notifyOnResponse: true,
        notifyOnTask: true,
        notifyOnMemory: false
    });

    const [autoReplyConfig, setAutoReplyConfig] = useState([]);
    const [savingAutoReply, setSavingAutoReply] = useState(false);
    const [error, setError] = useState('');

    const toggleSetting = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: '📊', path: '/dashboard' },
        { id: 'activity', label: 'Activity', icon: '💬', path: '/dashboard/activity' },
        { id: 'tasks', label: 'Tasks', icon: '✅', path: '/dashboard/tasks' },
        { id: 'memories', label: 'Memories', icon: '💭', path: '/dashboard/memories' },
        { id: 'playground', label: 'AI Playground', icon: '🤖', path: '/dashboard/playground' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/dashboard/settings' }
    ];

    const tabs = [
        { id: 'platforms', label: 'Connected Platforms', icon: '💬' },
        { id: 'rules', label: 'Auto-Response Rules', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'account', label: 'Account', icon: '👤' }
    ];

    useEffect(() => {
        let isMounted = true;

        const fetchConfig = async () => {
            try {
                setError('');
                const res = await apiClient.get('/me/auto-reply');
                if (!isMounted) return;
                setAutoReplyConfig(res.data.channels || []);
            } catch {
                if (!isMounted) return;
                setError('Unable to load auto-reply configuration.');
            }
        };

        fetchConfig();

        return () => {
            isMounted = false;
        };
    }, []);

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'settings'
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
                            <p className="text-gray-600">Manage your AI Twin configuration</p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-gray-900 font-semibold">
                            Y
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6">

                    {error && (
                        <div className="max-w-3xl mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-white text-black'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="max-w-3xl">

                        {/* Platforms Tab */}
                        {activeTab === 'platforms' && (
                            <div className="space-y-4">
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                <span className="text-2xl">💬</span>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-900 font-semibold">WhatsApp</h3>
                                                <p className="text-sm text-gray-600">Connected • Last active: 2 mins ago</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => alert('WhatsApp disconnection is not yet implemented.')}
                                            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                <span className="text-2xl">✈️</span>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-900 font-semibold">Telegram</h3>
                                                <p className="text-sm text-gray-600">Not connected</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.open('https://t.me/YOUR_BOT_USERNAME', '_blank')}
                                            className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-gray-900 transition-all"
                                        >
                                            Connect
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                                <span className="text-2xl">📷</span>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-900 font-semibold">Instagram</h3>
                                                <p className="text-sm text-gray-600">Coming soon</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed">
                                            Soon
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rules Tab (now wired to backend auto-reply config) */}
                        {activeTab === 'rules' && (
                            <div className="space-y-6">
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="text-gray-900 font-semibold mb-4">Auto-Response by Channel</h3>
                                    <div className="space-y-4">
                                        {autoReplyConfig.map((cfg) => (
                                            <div
                                                key={cfg.channel}
                                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="text-gray-900 font-medium mb-1">
                                                        {cfg.channel === 'telegram'
                                                            ? 'Telegram auto-replies'
                                                            : `${cfg.channel} auto-replies`}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Allow AI Twin to respond automatically on {cfg.channel}.
                                                    </p>
                                                </div>
                                                <button
                                                    disabled={savingAutoReply}
                                                    onClick={async () => {
                                                        try {
                                                            setSavingAutoReply(true);
                                                            setError('');
                                                            const nextEnabled = !cfg.auto_reply_enabled;
                                                            await apiClient.post('/me/auto-reply', {
                                                                channel: cfg.channel,
                                                                auto_reply_enabled: nextEnabled,
                                                                confidence_threshold: cfg.confidence_threshold ?? 0,
                                                            });
                                                            const res = await apiClient.get('/me/auto-reply');
                                                            setAutoReplyConfig(res.data.channels || []);
                                                        } catch {
                                                            setError('Failed to update auto-reply settings.');
                                                        } finally {
                                                            setSavingAutoReply(false);
                                                        }
                                                    }}
                                                    className={`relative w-12 h-6 rounded-full transition-all ${cfg.auto_reply_enabled ? 'bg-primary-500' : 'bg-gray-700'
                                                        } ${savingAutoReply ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                >
                                                    <div
                                                        className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${cfg.auto_reply_enabled ? 'right-0.5' : 'left-0.5'
                                                            }`}
                                                    ></div>
                                                </button>
                                            </div>
                                        ))}
                                        {autoReplyConfig.length === 0 && (
                                            <p className="text-sm text-gray-600">
                                                No channels configured yet. Connect a platform first.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                <h3 className="text-gray-900 font-semibold mb-4">Notification Preferences</h3>
                                <div className="space-y-4">

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                                        <div>
                                            <h4 className="text-gray-900 font-medium mb-1">Auto-responses</h4>
                                            <p className="text-sm text-gray-600">Get notified when AI responds</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('notifyOnResponse')}
                                            className={`relative w-12 h-6 rounded-full transition-all ${settings.notifyOnResponse ? 'bg-primary-500' : 'bg-gray-700'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.notifyOnResponse ? 'right-0.5' : 'left-0.5'
                                                }`}></div>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                                        <div>
                                            <h4 className="text-gray-900 font-medium mb-1">Task extraction</h4>
                                            <p className="text-sm text-gray-600">Get notified when tasks are created</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('notifyOnTask')}
                                            className={`relative w-12 h-6 rounded-full transition-all ${settings.notifyOnTask ? 'bg-primary-500' : 'bg-gray-700'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.notifyOnTask ? 'right-0.5' : 'left-0.5'
                                                }`}></div>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                                        <div>
                                            <h4 className="text-gray-900 font-medium mb-1">New memories</h4>
                                            <p className="text-sm text-gray-600">Get notified when AI learns something new</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSetting('notifyOnMemory')}
                                            className={`relative w-12 h-6 rounded-full transition-all ${settings.notifyOnMemory ? 'bg-primary-500' : 'bg-gray-700'
                                                }`}
                                        >
                                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.notifyOnMemory ? 'right-0.5' : 'left-0.5'
                                                }`}></div>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div className="space-y-4">
                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="text-gray-900 font-semibold mb-4">Account Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Yash Singh"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-primary-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 mb-1 block">Email</label>
                                            <input
                                                type="email"
                                                defaultValue="yash@example.com"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:border-primary-500 outline-none"
                                            />
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-gray-900 transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-2xl p-6">
                                    <h3 className="text-gray-900 font-semibold mb-4">Subscription</h3>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-gray-900 font-medium">Free Plan</p>
                                            <p className="text-sm text-gray-600">Limited to 50 auto-responses/month</p>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-gray-900 hover:opacity-90 transition-all">
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-600 mb-4">Permanently delete your account and all data</p>
                                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}