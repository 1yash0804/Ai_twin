"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { Download, Plus, X, CheckCircle2, Clock, AlertCircle, ChevronDown, Zap } from "lucide-react";
import { fetchMeTasks, createTask, type Task, type TaskCreatePayload } from "@/lib/api";
import { getToken } from "@/lib/auth";

// ─── Design tokens ────────────────────────────────────────────────────────────

const PRIORITY = {
    high: {
        pill: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
        dot: "bg-rose-500",
        label: "High",
    },
    medium: {
        pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        dot: "bg-amber-500",
        label: "Medium",
    },
    low: {
        pill: "bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
        dot: "bg-stone-400 dark:bg-zinc-500",
        label: "Low",
    },
} as const;

const SOURCE = {
    telegram: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    manual: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    chat: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

const STATUS = {
    pending: {
        pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        icon: <Clock size={11} />,
    },
    done: {
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        icon: <CheckCircle2 size={11} />,
    },
};

// ─── Confidence Bar ───────────────────────────────────────────────────────────

function ConfidenceBar({ score }: { score: number }) {
    const pct = Math.round(score * 100);
    const color = pct >= 80 ? "bg-emerald-500" : pct >= 55 ? "bg-amber-500" : "bg-rose-500";
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex-1 h-1.5 bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden max-w-[64px]">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-[10px] font-bold text-stone-500 dark:text-zinc-400 tabular-nums">{pct}%</span>
        </div>
    );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="border-b border-stone-100 dark:border-zinc-800/60">
            {[...Array(7)].map((_, i) => (
                <td key={i} className="px-6 py-5">
                    <div className="h-4 bg-stone-100 dark:bg-zinc-800 rounded animate-pulse"
                        style={{ width: `${40 + i * 8}%` }} />
                </td>
            ))}
        </tr>
    );
}

// ─── Input field ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls = `
  w-full rounded-xl px-4 py-3 text-sm font-medium outline-none
  border transition-colors duration-150
  bg-stone-50  border-stone-200  text-stone-900  placeholder-stone-400
  dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500
  focus:border-indigo-500 dark:focus:border-indigo-500
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

    // Form state
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
    const [newDueDate, setNewDueDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const loadTasks = async () => {
        setLoading(true); setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Not authenticated");
            setTasks(await fetchMeTasks(token));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tasks");
        } finally { setLoading(false); }
    };

    useEffect(() => { loadTasks(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null); setSubmitting(true);
        try {
            const token = getToken();
            if (!token) throw new Error("Not authenticated");
            const payload: TaskCreatePayload = {
                title: newTitle, description: newDescription,
                priority: newPriority, due_date: newDueDate || null,
            };
            const created = await createTask(token, payload);
            setTasks(prev => [created, ...prev]);
            setShowModal(false);
            setNewTitle(""); setNewDescription(""); setNewPriority("medium"); setNewDueDate("");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Failed to create task");
        } finally { setSubmitting(false); }
    };

    const shown = tasks.filter(t =>
        filter === "all" ? true : t.status === filter
    );

    const pendingCount = tasks.filter(t => t.status === "pending").length;
    const doneCount = tasks.filter(t => t.status === "done").length;

    return (
        <div className="min-h-full bg-stone-50 dark:bg-zinc-950 p-6 lg:p-8 space-y-7 transition-colors duration-200">

            {/* ── Header ── */}
            <FadeUp>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                            Commitments
                        </h1>
                        <p className="text-sm font-medium text-stone-500 dark:text-zinc-400 mt-1.5">
                            Tasks and obligations extracted from your conversations
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="
              p-2.5 rounded-xl transition-all shadow-sm
              border border-stone-200 bg-white text-stone-400
              hover:text-stone-700 hover:border-stone-300
              dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500
              dark:hover:text-zinc-200 dark:hover:border-zinc-700
            ">
                            <Download size={17} />
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
                bg-indigo-600 text-white hover:bg-indigo-700
                shadow-lg shadow-indigo-500/25 transition-all"
                        >
                            <Plus size={16} />
                            Add Task
                        </button>
                    </div>
                </div>
            </FadeUp>

            {/* ── Summary chips ── */}
            <FadeUp delay={0.06}>
                <div className="flex items-center gap-3 flex-wrap">
                    {[
                        { id: "all", label: "All tasks", count: tasks.length },
                        { id: "pending", label: "Pending", count: pendingCount },
                        { id: "done", label: "Done", count: doneCount },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as typeof filter)}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                border transition-all duration-150
                ${filter === tab.id
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20"
                                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                                }
              `}
                        >
                            {tab.label}
                            <span className={`
                text-xs px-1.5 py-0.5 rounded-md font-bold
                ${filter === tab.id
                                    ? "bg-white/20 text-white"
                                    : "bg-stone-100 text-stone-500 dark:bg-zinc-800 dark:text-zinc-400"
                                }
              `}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </FadeUp>

            {/* ── Table ── */}
            <FadeUp delay={0.1}>
                <div className="rounded-2xl overflow-hidden border shadow-sm
          border-stone-200 bg-white
          dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">

                    {/* Table header */}
                    <div className="px-6 py-4 border-b flex items-center justify-between
            border-stone-100 bg-stone-50/50
            dark:border-zinc-800 dark:bg-zinc-900">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 dark:text-zinc-500">
                            {shown.length} {filter === "all" ? "total" : filter}
                        </span>
                        {error && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                                <AlertCircle size={13} /> {error}
                            </span>
                        )}
                    </div>

                    {/* Skeleton */}
                    {loading && (
                        <table className="w-full">
                            <tbody>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
                        </table>
                    )}

                    {/* Empty */}
                    {!loading && !error && tasks.length === 0 && (
                        <div className="py-20 text-center space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-zinc-800
                flex items-center justify-center mx-auto">
                                <Zap size={18} className="text-stone-300 dark:text-zinc-600" />
                            </div>
                            <p className="text-sm font-semibold text-stone-500 dark:text-zinc-400">No tasks yet</p>
                            <p className="text-xs font-medium text-stone-400 dark:text-zinc-500">
                                Create one or send a Telegram message to extract automatically
                            </p>
                        </div>
                    )}

                    {/* Table */}
                    {!loading && !error && shown.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-stone-100 dark:border-zinc-800/60">
                                        {["Task", "Source", "Due Date", "Priority", "Confidence", "Status", ""].map(h => (
                                            <th key={h} className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 dark:text-zinc-500">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50 dark:divide-zinc-800/60">
                                    {shown.map((task) => {
                                        const src = (task.source ?? "manual").toLowerCase();
                                        const prio = PRIORITY[task.priority as keyof typeof PRIORITY] ?? PRIORITY.medium;
                                        const stat = STATUS[task.status as keyof typeof STATUS] ?? STATUS.pending;
                                        const srcCls = SOURCE[src as keyof typeof SOURCE] ?? SOURCE.manual;

                                        return (
                                            <tr key={task.id}
                                                className="group hover:bg-stone-50/80 dark:hover:bg-zinc-800/40 transition-colors duration-150 cursor-pointer">

                                                {/* Task title + description */}
                                                <td className="px-6 py-4 max-w-xs">
                                                    <p className="text-sm font-bold text-stone-900 dark:text-zinc-100
                            group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                            transition-colors leading-snug">
                                                        {task.title ?? task.description}
                                                    </p>
                                                    {task.title && task.description && (
                                                        <p className="text-xs font-medium text-stone-400 dark:text-zinc-500 mt-1 line-clamp-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-widest
                            px-1.5 py-0.5 rounded bg-stone-100 text-stone-400
                            dark:bg-zinc-800 dark:text-zinc-600">
                                                        #{task.id}
                                                    </span>
                                                </td>

                                                {/* Source */}
                                                <td className="px-6 py-4">
                                                    <span className={`
                            px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-widest
                            ${srcCls}
                          `}>
                                                        {src}
                                                    </span>
                                                </td>

                                                {/* Due date */}
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-stone-600 dark:text-zinc-300">
                                                        {task.due_date ?? <span className="text-stone-300 dark:text-zinc-600">—</span>}
                                                    </span>
                                                </td>

                                                {/* Priority */}
                                                <td className="px-6 py-4">
                                                    <span className={`
                            flex items-center gap-1.5 w-fit
                            px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest
                            ${prio.pill}
                          `}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${prio.dot}`} />
                                                        {prio.label}
                                                    </span>
                                                </td>

                                                {/* Confidence */}
                                                <td className="px-6 py-4">
                                                    {task.source === "manual"
                                                        ? <span className="text-[10px] font-bold text-stone-300 dark:text-zinc-700">—</span>
                                                        : <ConfidenceBar score={task.confidence_score} />
                                                    }
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span className={`
                            flex items-center gap-1.5 w-fit
                            px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest
                            ${stat.pill}
                          `}>
                                                        {stat.icon}
                                                        {task.status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <button className="
                            p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                            transition-all duration-150
                            text-stone-400 hover:text-stone-700 hover:bg-stone-100
                            dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800
                          ">
                                                        <ChevronDown size={15} strokeWidth={2.5} />
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

            {/* ── Add Task Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6
              bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.96, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 16 }}
                            transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            className="w-full max-w-md rounded-2xl p-7 shadow-2xl
                bg-white border border-stone-200
                dark:bg-zinc-900 dark:border-zinc-800
                dark:shadow-black/40"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                                        New Task
                                    </h2>
                                    <p className="text-xs font-medium text-stone-400 dark:text-zinc-500 mt-0.5">
                                        Manually add a commitment to track
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-xl transition-colors
                    text-stone-400 hover:text-stone-700 hover:bg-stone-100
                    dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form className="space-y-4" onSubmit={handleCreate}>
                                <Field label="Title">
                                    <input
                                        type="text"
                                        placeholder="Send proposal to client"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                        required
                                        className={inputCls}
                                    />
                                </Field>

                                <Field label="Description">
                                    <textarea
                                        placeholder="Brief details about this task..."
                                        value={newDescription}
                                        onChange={e => setNewDescription(e.target.value)}
                                        required
                                        rows={3}
                                        className={`${inputCls} resize-none`}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Priority">
                                        <select
                                            value={newPriority}
                                            onChange={e => setNewPriority(e.target.value as "low" | "medium" | "high")}
                                            className={inputCls}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </Field>

                                    <Field label="Due Date">
                                        <input
                                            type="date"
                                            value={newDueDate}
                                            onChange={e => setNewDueDate(e.target.value)}
                                            className={inputCls}
                                        />
                                    </Field>
                                </div>

                                {submitError && (
                                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                        <AlertCircle size={12} /> {submitError}
                                    </p>
                                )}

                                <div className="flex gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold transition-colors
                      border border-stone-200 text-stone-600 hover:bg-stone-50
                      dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={submitting}
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold transition-colors
                      bg-indigo-600 text-white hover:bg-indigo-700
                      shadow-lg shadow-indigo-500/25
                      disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? "Creating…" : "Create Task"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}