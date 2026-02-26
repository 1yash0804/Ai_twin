"use client";

import { useEffect, useState } from "react";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { Brain, CheckSquare, Send, MessageCircle } from "lucide-react";
import { fetchMeActivities, type ActivityItem } from "@/lib/api";
import { getToken } from "@/lib/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    const inner = match[0].replace(/[\[\]]/g, "");
    return inner.replace("_", " ");
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

const tagColors: Record<string, string> = {
    "GOAL": "bg-violet-50 text-violet-600",
    "PREFERENCE": "bg-amber-50 text-amber-600",
    "PERSONAL FACT": "bg-emerald-50 text-emerald-600",
    "COMMITMENT": "bg-rose-50 text-rose-600",
};

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({ item, index }: { item: ActivityItem; index: number }) {
    const clean = cleanText(item.text);
    const sender = getSenderName(item.text);
    const group = getGroupName(item.text);
    const tag = item.type === "memory" ? getMemoryTag(item.text) : null;
    const isLast = false;

    // Skip raw conversation messages
    if (
        item.text.startsWith("user:") ||
        item.text.startsWith("assistant:")
    ) return null;

    const isMemory = item.type === "memory";
    const isTelegram = item.source === "telegram";

    return (
        <FadeUp delay={index * 0.06}>
            <div className="relative pl-16 pb-10 last:pb-0">
                {/* Timeline line */}
                <div className="absolute top-7 left-[27px] bottom-0 w-px bg-slate-100" />

                {/* Icon node */}
                <div
                    className={`absolute top-0 left-0 w-14 h-14 rounded-2xl flex items-center justify-center z-10 border-2 shadow-sm ${isMemory
                            ? "bg-violet-50 border-violet-100"
                            : "bg-amber-50 border-amber-100"
                        }`}
                >
                    {isTelegram ? (
                        <Send size={20} className="text-blue-500" strokeWidth={2} />
                    ) : isMemory ? (
                        <Brain size={20} className="text-violet-500" strokeWidth={2} />
                    ) : (
                        <CheckSquare size={20} className="text-amber-500" strokeWidth={2} />
                    )}
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-600/5 transition-all duration-300 group">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1 min-w-0">
                            {/* Action label */}
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {isMemory ? "Memory captured" : "Task extracted"}
                            </p>

                            {/* Main text */}
                            <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                                {clean || "Activity recorded"}
                            </p>

                            {/* Meta row */}
                            <div className="flex items-center flex-wrap gap-2 pt-1">
                                {tag && (
                                    <span
                                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${tagColors[tag] ?? "bg-slate-50 text-slate-500"
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                )}
                                {sender && (
                                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                        <MessageCircle size={10} />
                                        {sender}
                                        {group ? ` in ${group}` : ""}
                                    </span>
                                )}
                                {!sender && (
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        {item.source || "system"}
                                    </span>
                                )}
                                {item.type === "task" && item.status && (
                                    <span
                                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.status === "pending"
                                                ? "bg-amber-50 text-amber-600"
                                                : "bg-emerald-50 text-emerald-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Time + type */}
                        <div className="text-right shrink-0 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {formatTime(item.created_at)}
                            </p>
                            <div
                                className={`flex items-center justify-end gap-1.5 px-2.5 py-1 rounded-full ${isMemory ? "bg-violet-50" : "bg-amber-50"
                                    }`}
                            >
                                <div
                                    className={`w-1.5 h-1.5 rounded-full ${isMemory ? "bg-violet-500" : "bg-amber-500"
                                        }`}
                                />
                                <span
                                    className={`text-[9px] font-black uppercase tracking-widest ${isMemory ? "text-violet-600" : "text-amber-600"
                                        }`}
                                >
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

    // Filter out raw conversation messages
    const filtered = activities.filter(
        (a) =>
            !a.text.startsWith("user:") &&
            !a.text.startsWith("assistant:")
    );

    return (
        <div className="p-10 space-y-12 bg-slate-50/50 min-h-full">
            <FadeUp>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Activity Log</h1>
                    <p className="text-base text-slate-500 font-medium">
                        Real-time timeline of tasks and memories extracted from your conversations.
                    </p>
                </div>
            </FadeUp>

            {/* Stats bar */}
            <FadeUp delay={0.1}>
                <div className="flex items-center gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
                        <CheckSquare size={16} className="text-amber-500" />
                        <span className="text-sm font-bold text-slate-900">
                            {filtered.filter((a) => a.type === "task").length} Tasks
                        </span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
                        <Brain size={16} className="text-violet-500" />
                        <span className="text-sm font-bold text-slate-900">
                            {filtered.filter((a) => a.type === "memory").length} Memories
                        </span>
                    </div>
                </div>
            </FadeUp>

            {/* Timeline */}
            <div className="max-w-3xl space-y-0 pt-2">
                {loading && (
                    <div className="text-sm font-semibold text-slate-400 pl-16">Loading activity...</div>
                )}
                {!loading && error && (
                    <div className="text-sm font-semibold text-rose-500 pl-16">{error}</div>
                )}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-sm font-semibold text-slate-400 pl-16">
                        No activity yet. Send a Telegram message to get started.
                    </div>
                )}
                {!loading &&
                    !error &&
                    filtered.map((item, i) => (
                        <ActivityCard key={item.id} item={item} index={i} />
                    ))}
            </div>
        </div>
    );
}