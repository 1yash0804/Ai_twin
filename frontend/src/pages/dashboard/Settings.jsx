import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterGlitch from '../../components/LetterGlitch';

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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.id === 'settings'
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
                            <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
                            <p className="text-gray-400">Manage your AI Twin configuration</p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                            Y
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6">

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
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
                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                <span className="text-2xl">💬</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">WhatsApp</h3>
                                                <p className="text-sm text-gray-400">Connected • Last active: 2 mins ago</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all">
                                            Disconnect
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                <span className="text-2xl">✈️</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Telegram</h3>
                                                <p className="text-sm text-gray-400">Not connected</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all">
                                            Connect
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                                <span className="text-2xl">📷</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Instagram</h3>
                                                <p className="text-sm text-gray-400">Coming soon</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-white/5 text-gray-500 cursor-not-allowed">
                                            Soon
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rules Tab */}
                        {activeTab === 'rules' && (
                            <div className="space-y-6">
                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Auto-Response Rules</h3>
                                    <div className="space-y-4">

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium mb-1">Simple questions</h4>
                                                <p className="text-sm text-gray-400">"What time?", "Where?", Yes/No questions</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSetting('autoRespondSimple')}
                                                className={`relative w-12 h-6 rounded-full transition-all ${settings.autoRespondSimple ? 'bg-primary-500' : 'bg-gray-700'
                                                    }`}
                                            >
                                                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.autoRespondSimple ? 'right-0.5' : 'left-0.5'
                                                    }`}></div>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium mb-1">Scheduling messages</h4>
                                                <p className="text-sm text-gray-400">"Coffee at 3pm?", "Meeting tomorrow?"</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSetting('autoRespondScheduling')}
                                                className={`relative w-12 h-6 rounded-full transition-all ${settings.autoRespondScheduling ? 'bg-primary-500' : 'bg-gray-700'
                                                    }`}
                                            >
                                                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.autoRespondScheduling ? 'right-0.5' : 'left-0.5'
                                                    }`}></div>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                            <div className="flex-1">
                                                <h4 className="text-white font-medium mb-1">Work contacts</h4>
                                                <p className="text-sm text-gray-400">Auto-respond to professional contacts</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSetting('autoRespondWork')}
                                                className={`relative w-12 h-6 rounded-full transition-all ${settings.autoRespondWork ? 'bg-primary-500' : 'bg-gray-700'
                                                    }`}
                                            >
                                                <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${settings.autoRespondWork ? 'right-0.5' : 'left-0.5'
                                                    }`}></div>
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-semibold mb-2">Protected Contacts</h3>
                                    <p className="text-sm text-gray-400 mb-4">AI will never auto-respond to these people</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">Family</span>
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">Close Friends</span>
                                        <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">Unknown Numbers</span>
                                        <button className="px-3 py-1 rounded-full border border-white/20 text-gray-400 hover:bg-white/5 text-sm">
                                            + Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
                                <div className="space-y-4">

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Auto-responses</h4>
                                            <p className="text-sm text-gray-400">Get notified when AI responds</p>
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

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Task extraction</h4>
                                            <p className="text-sm text-gray-400">Get notified when tasks are created</p>
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

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div>
                                            <h4 className="text-white font-medium mb-1">New memories</h4>
                                            <p className="text-sm text-gray-400">Get notified when AI learns something new</p>
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
                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Account Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-1 block">Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Yash Singh"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 mb-1 block">Email</label>
                                            <input
                                                type="email"
                                                defaultValue="yash@example.com"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 outline-none"
                                            />
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-semibold mb-4">Subscription</h3>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-white font-medium">Free Plan</p>
                                            <p className="text-sm text-gray-400">Limited to 50 auto-responses/month</p>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:opacity-90 transition-all">
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </div>

                                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all data</p>
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