"use client";

import { useEffect, useState } from "react";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { Brain, CheckSquare, Send, MessageCircle } from "lucide-react";
import { fetchMeActivities, type ActivityItem } from "@/lib/api";
import { getToken } from "@/lib/auth";

// ─── Helpers (untouched) ──────────────────────────────────────────────────────

function cleanText(text: string): string {
    let t = text.replace(/^(user|assistant):\s*/i, "");
    t = t.replace(/^\[From ([^\]]+)\]\s*/i, "");
    t = t.replace(/^\[[A-Z_]+\]\s*/, "");
    return t.trim();
}

function getSenderName(text: string): string | null {
    const match = text.match(/^\[From ([^,\]]+)/i);
    return match ? match[1].trim() : null;
}

function getGroupName(text: string): string | null {
    const match = text.match(/in ([^\]]+)\]/i);
    return match ? match[1].trim() : null;
}

function getMemoryTag(text: string): string | null {
    const match = text.match(/^\[[A-Z_]+\]/);
    if (!match) return null;
    return match[0].replace(/[\[\]]/g, "").replace("_", " ");
}

function formatTime(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return "yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Tag color map — light + dark
const TAG_STYLES: Record<string, string> = {
    "GOAL": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    "PREFERENCE": "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-500/10  dark:text-amber-400  dark:border-amber-500/20",
    "PERSONAL FACT": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    "COMMITMENT": "bg-rose-50   text-rose-700   border-rose-200   dark:bg-rose-500/10   dark:text-rose-400   dark:border-rose-500/20",
};

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({ item, index }: { item: ActivityItem; index: number }) {
    const clean = cleanText(item.text);
    const sender = getSenderName(item.text);
    const group = getGroupName(item.text);
    const tag = item.type === "memory" ? getMemoryTag(item.text) : null;

    if (item.text.startsWith("user:") || item.text.startsWith("assistant:")) return null;

    const isMemory = item.type === "memory";
    const isTelegram = item.source === "telegram";

    return (
        <FadeUp delay={index * 0.06}>
            <div className="relative pl-16 pb-8 last:pb-0">

                {/* Timeline line */}
                <div className="absolute top-7 left-[27px] bottom-0 w-px
          bg-stone-200 dark:bg-zinc-800" />

                {/* Icon node */}
                <div className={`
          absolute top-0 left-0 w-14 h-14 rounded-2xl z-10
          flex items-center justify-center border-2 shadow-sm
          ${isMemory
                        ? "bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20"
                        : "bg-amber-50  border-amber-200  dark:bg-amber-500/10  dark:border-amber-500/20"}
        `}>
                    {isTelegram ? (
                        <Send size={20} className="text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    ) : isMemory ? (
                        <Brain size={20} className="text-violet-600 dark:text-violet-400" strokeWidth={2} />
                    ) : (
                        <CheckSquare size={20} className="text-amber-600 dark:text-amber-400" strokeWidth={2} />
                    )}
                </div>

                {/* Card */}
                <div className="
          border rounded-2xl p-5 transition-all duration-300 group
          bg-white border-stone-200 shadow-sm
          hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5
          dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none
          dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-500/5
        ">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">

                            {/* Action label */}
                            <p className="text-[10px] font-bold uppercase tracking-widest
                text-stone-400 dark:text-zinc-500">
                                {isMemory ? "Memory captured" : "Task extracted"}
                            </p>

                            {/* Main text — hero of the card */}
                            <p className="text-base font-bold leading-snug
                text-stone-900 dark:text-white
                group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                transition-colors">
                                {clean || "Activity recorded"}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center flex-wrap gap-2 pt-0.5">
                                {tag && (
                                    <span className={`
                    text-[9px] font-bold uppercase tracking-widest
                    px-2 py-0.5 rounded-md border
                    ${TAG_STYLES[tag] ?? "bg-stone-100 text-stone-500 border-stone-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"}
                  `}>
                                        {tag}
                                    </span>
                                )}
                                {sender ? (
                                    <span className="text-[11px] font-semibold flex items-center gap-1
                    text-stone-500 dark:text-zinc-400">
                                        <MessageCircle size={10} />
                                        {sender}{group ? ` in ${group}` : ""}
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-semibold uppercase tracking-wide
                    text-stone-400 dark:text-zinc-500">
                                        {item.source || "system"}
                                    </span>
                                )}
                                {item.type === "task" && item.status && (
                                    <span className={`
                    text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border
                    ${item.status === "pending"
                                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"}
                  `}>
                                        {item.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Time + type badge */}
                        <div className="text-right shrink-0 space-y-2">
                            <p className="text-[11px] font-bold uppercase tracking-widest
                text-stone-400 dark:text-zinc-500">
                                {formatTime(item.created_at)}
                            </p>
                            <div className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border
                ${isMemory
                                    ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                                    : "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-500/10  dark:text-amber-400  dark:border-amber-500/20"}
              `}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isMemory ? "bg-violet-500 dark:bg-violet-400" : "bg-amber-500 dark:bg-amber-400"}`} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">
                                    {item.type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FadeUp>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActivityLogPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) throw new Error("Not authenticated");
                const data = await fetchMeActivities(token);
                setActivities(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load activity");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = activities.filter(
        (a) => !a.text.startsWith("user:") && !a.text.startsWith("assistant:")
    );

    const taskCount = filtered.filter(a => a.type === "task").length;
    const memoryCount = filtered.filter(a => a.type === "memory").length;

    return (
        <div className="min-h-full bg-stone-50 dark:bg-zinc-950 p-6 lg:p-10 space-y-8 transition-colors duration-200">

            {/* ── Header ── */}
            <FadeUp>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                        Activity Log
                    </h1>
                    <p className="text-sm font-medium text-stone-500 dark:text-zinc-400 mt-1.5">
                        Real-time timeline of tasks and memories extracted from your conversations
                    </p>
                </div>
            </FadeUp>

            {/* ── Stats bar ── */}
            <FadeUp delay={0.08}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-sm
            bg-white border border-stone-200
            dark:bg-zinc-900 dark:border-zinc-800">
                        <CheckSquare size={15} className="text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                            {taskCount}
                        </span>
                        <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500">tasks</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-sm
            bg-white border border-stone-200
            dark:bg-zinc-900 dark:border-zinc-800">
                        <Brain size={15} className="text-violet-600 dark:text-violet-400" />
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                            {memoryCount}
                        </span>
                        <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500">memories</span>
                    </div>
                </div>
            </FadeUp>

            {/* ── Timeline ── */}
            <div className="max-w-3xl pt-2">
                {loading && (
                    <div className="pl-16 space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                                <div className="flex-1 rounded-2xl bg-stone-100 dark:bg-zinc-800 animate-pulse h-24" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="text-sm font-semibold text-red-600 dark:text-red-400 pl-16">
                        {error}
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-sm font-medium text-stone-400 dark:text-zinc-500 pl-16">
                        No activity yet — send a Telegram message to get started.
                    </div>
                )}

                {!loading && !error && filtered.map((item, i) => (
                    <ActivityCard key={item.id} item={item} index={i} />
                ))}
            </div>
        </div>
    );
}