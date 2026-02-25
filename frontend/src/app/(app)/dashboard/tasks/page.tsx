"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { MoreVertical, Filter, Download, Plus, X } from "lucide-react";
import { fetchMeTasks, createTask, type Task, type TaskCreatePayload } from "@/lib/api";
import { getToken } from "@/lib/auth";

const priorityStyles = {
    high: "bg-rose-50 text-rose-600 border-rose-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-slate-50 text-slate-500 border-slate-100",
};

const sourceStyles: Record<string, string> = {
    telegram: "bg-blue-50 text-blue-600",
    manual: "bg-indigo-50 text-indigo-600",
    chat: "bg-emerald-50 text-emerald-600",
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // New task form state
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
    const [newDueDate, setNewDueDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Not authenticated");
            const data = await fetchMeTasks(token);
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitting(true);
        try {
            const token = getToken();
            if (!token) throw new Error("Not authenticated");

            const payload: TaskCreatePayload = {
                title: newTitle,
                description: newDescription,
                priority: newPriority,
                due_date: newDueDate || null,
            };

            const created = await createTask(token, payload);
            setTasks((prev) => [created, ...prev]);
            setShowModal(false);
            setNewTitle("");
            setNewDescription("");
            setNewPriority("medium");
            setNewDueDate("");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Failed to create task");
        } finally {
            setSubmitting(false);
        }
    };

    const confidencePct = (score: number) => Math.round(score * 100);

    return (
        <div className="p-10 space-y-10 bg-slate-50/50 min-h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <FadeUp>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Commitments</h1>
                        <p className="text-base text-slate-500 font-medium">
                            Manage tasks and obligations extracted from chat.
                        </p>
                    </div>
                </FadeUp>
                <div className="flex gap-4">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
                    >
                        <Plus size={20} />
                        Add Task
                    </button>
                </div>
            </div>

            <FadeUp delay={0.1}>
                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm shadow-slate-200/50">
                    {/* Table header bar */}
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                Items <span className="text-slate-900">{tasks.length}</span>
                            </span>
                        </div>
                        <button className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all">
                            <Filter size={14} className="text-slate-400" />
                            Filter
                        </button>
                    </div>

                    {/* Loading / error / empty states */}
                    {loading && (
                        <div className="py-20 text-center text-sm font-semibold text-slate-400">
                            Loading tasks...
                        </div>
                    )}
                    {!loading && error && (
                        <div className="py-20 text-center text-sm font-semibold text-rose-500">{error}</div>
                    )}
                    {!loading && !error && tasks.length === 0 && (
                        <div className="py-20 text-center text-sm font-semibold text-slate-400">
                            No tasks yet. Create one or send a message via Telegram.
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && tasks.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/10">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Due Date</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-5 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tasks.map((task) => {
                                        const pct = confidencePct(task.confidence_score);
                                        const src = (task.source ?? "manual").toLowerCase();
                                        return (
                                            <tr key={task.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {task.title ?? task.description}
                                                    </p>
                                                    {task.title && (
                                                        <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded">#{task.id}</span>
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${sourceStyles[src] ?? "bg-slate-50 text-slate-500"
                                                            }`}
                                                    >
                                                        {src}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">
                                                        {task.due_date ?? "—"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${priorityStyles[task.priority] ?? priorityStyles.medium
                                                            }`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {task.source === "manual" ? (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase">—</span>
                                                    ) : (
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
                                                                <div
                                                                    className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-400">{pct}%</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${task.status === "pending"
                                                                ? "bg-amber-50 text-amber-600"
                                                                : "bg-emerald-50 text-emerald-600"
                                                            }`}
                                                    >
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-300 hover:text-slate-900 transition-all">
                                                        <MoreVertical size={18} strokeWidth={2.5} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </FadeUp>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        key="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Task</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form className="space-y-5" onSubmit={handleCreateTask}>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Send proposal to client"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Brief details about this task..."
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        required
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            Priority
                                        </label>
                                        <select
                                            value={newPriority}
                                            onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            value={newDueDate}
                                            onChange={(e) => setNewDueDate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                                        />
                                    </div>
                                </div>

                                {submitError && (
                                    <p className="text-sm font-semibold text-rose-600">{submitError}</p>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={submitting}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                                >
                                    {submitting ? "Creating..." : "Create Task"}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}