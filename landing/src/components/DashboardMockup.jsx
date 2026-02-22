"use client";
import { motion } from "framer-motion";

const tasks = [
    {
        title: "Finalize proposal for client",
        client: "Acme Corp",
        deadline: "Friday",
        priority: "High",
        done: false,
    },
    {
        title: "Send project update",
        client: "Design Studio",
        deadline: "Today",
        priority: "High",
        done: false,
    },
    {
        title: "Approve contract draft",
        client: "Legal",
        deadline: "Thursday",
        priority: "Medium",
        done: true,
    },
];

const priorityStyles = {
    High: "bg-gray-900 text-white",
    Medium: "bg-gray-100 text-gray-600",
    Low: "bg-gray-50 text-gray-400",
};

export default function DashboardMockup() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden w-full max-w-md mx-auto">
            {/* Window chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                </div>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">TwinLabs Command Center</span>
                <div className="w-10" />
            </div>

            <div className="flex" style={{ height: "400px" }}>
                {/* Sidebar */}
                <div className="w-14 sm:w-16 bg-gray-50 border-r border-gray-200 p-3 flex flex-col items-center gap-6 shrink-0">
                    {[
                        { label: "Dashboard", active: true },
                        { label: "Tasks", active: false },
                        { label: "History", active: false },
                        { label: "Settings", active: false },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${item.active ? "bg-gray-900 shadow-sm" : "hover:bg-gray-200"
                                }`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-sm border-1.5 ${item.active ? "border-white" : "border-gray-400"}`} />
                        </div>
                    ))}
                </div>

                {/* Main Panel */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-gray-900">Operational Commitments</h3>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>

                    <div className="space-y-3 overflow-hidden">
                        {tasks.map((task, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                                className={`p-4 rounded-xl border transition-all ${task.done
                                        ? "border-gray-100 bg-gray-50 opacity-40 shrink-0"
                                        : "border-gray-200 bg-white shadow-sm"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className={`text-xs font-semibold leading-snug mb-2 ${task.done ? "line-through" : "text-gray-900"}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap text-[10px] font-medium uppercase tracking-tight">
                                            <span className="text-gray-400">{task.client}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                            <span className="text-gray-500">Extracted from chat</span>
                                        </div>
                                    </div>
                                    <div className={`shrink-0 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${priorityStyles[task.priority]}`}>
                                        {task.deadline}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Live extraction active</span>
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
