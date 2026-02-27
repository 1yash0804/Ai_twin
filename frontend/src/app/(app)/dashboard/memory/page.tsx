"use client";

import { useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { Brain, MessageCircle, Send, Search, X } from "lucide-react";
import { fetchMeMemories, type Memory } from "@/lib/api";
import { getToken } from "@/lib/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMemoryText(text: string): { tag: string | null; body: string } {
    const match = text.match(/^\[([A-Z_]+)\]\s*([\s\S]+)/);
    if (match) return { tag: match[1], body: match[2] };
    return { tag: null, body: text };
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const TAG_CONFIG: Record<string, {
    label: string;
    pill: string;       // light mode pill
    pillDark: string;   // dark mode pill
    cardAccent: string; // left border accent
}> = {
    GOAL: {
        label: "Goal",
        pill: "bg-violet-50 text-violet-700 border-violet-200",
        pillDark: "dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
        cardAccent: "border-l-violet-400 dark:border-l-violet-500/60",
    },
    PREFERENCE: {
        label: "Preference",
        pill: "bg-amber-50 text-amber-700 border-amber-200",
        pillDark: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        cardAccent: "border-l-amber-400 dark:border-l-amber-500/60",
    },
    PERSONAL_FACT: {
        label: "Personal Fact",
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pillDark: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        cardAccent: "border-l-emerald-400 dark:border-l-emerald-500/60",
    },
    COMMITMENT: {
        label: "Commitment",
        pill: "bg-rose-50 text-rose-700 border-rose-200",
        pillDark: "dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
        cardAccent: "border-l-rose-400 dark:border-l-rose-500/60",
    },
};

const DEFAULT_TAG = {
    label: "Memory",
    pill: "bg-stone-100 text-stone-600 border-stone-200",
    pillDark: "dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    cardAccent: "border-l-stone-300 dark:border-l-zinc-700",
};

const SOURCE_CONFIG: Record<string, { icon: ReactNode; label: string; style: string }> = {
    telegram: {
        icon: <Send size={12} strokeWidth={2} />,
        label: "Telegram",
        style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    },
    chat: {
        icon: <MessageCircle size={12} strokeWidth={2} />,
        label: "Chat",
        style: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    },
};

const FALLBACK_SOURCE = {
    icon: <Brain size={12} strokeWidth={2} />,
    label: "System",
    style: "bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

// All possible filter tabs
const FILTER_TABS = ["All", "Goal", "Preference", "Personal Fact", "Commitment"];

// ─── Memory Card ──────────────────────────────────────────────────────────────

function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
    const { tag, body } = parseMemoryText(memory.text);
    const tagCfg = tag ? (TAG_CONFIG[tag] ?? DEFAULT_TAG) : DEFAULT_TAG;
    const srcCfg = SOURCE_CONFIG[memory.source?.toLowerCase()] ?? FALLBACK_SOURCE;

    return (
        <FadeUp delay={index * 0.05}>
            <div className={`
        group flex flex-col h-full rounded-2xl overflow-hidden
        border-l-[3px] ${tagCfg.cardAccent}
        border border-stone-200 bg-white shadow-sm
        dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none
        hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-200
        dark:hover:border-indigo-500/30
        transition-all duration-300
      `}>
                <div className="flex flex-col flex-1 p-5 gap-4">

                    {/* Top row — tag + source */}
                    <div className="flex items-center justify-between gap-2">
                        {tag ? (
                            <span className={`
                text-[9px] font-bold uppercase tracking-widest
                px-2 py-0.5 rounded-md border
                ${tagCfg.pill} ${tagCfg.pillDark}
              `}>
                                {tagCfg.label}
                            </span>
                        ) : (
                            <span className={`
                text-[9px] font-bold uppercase tracking-widest
                px-2 py-0.5 rounded-md border
                ${DEFAULT_TAG.pill} ${DEFAULT_TAG.pillDark}
              `}>
                                Memory
                            </span>
                        )}

                        <span className={`
              flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest
              px-2 py-0.5 rounded-md border
              ${srcCfg.style}
            `}>
                            {srcCfg.icon}
                            {srcCfg.label}
                        </span>
                    </div>

                    {/* Memory body — the actual content, most important */}
                    <p className="
            text-sm font-semibold leading-relaxed flex-1
            text-stone-800 dark:text-zinc-100
            group-hover:text-indigo-700 dark:group-hover:text-indigo-300
            transition-colors duration-200
          ">
                        &ldquo;{body}&rdquo;
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-zinc-800">
                        <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500">
                            {formatDate(memory.created_at)}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-stone-100 dark:bg-zinc-800
              flex items-center justify-center
              group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10
              transition-colors">
                            <Brain size={10} className="text-stone-400 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                        </div>
                    </div>
                </div>
            </div>
        </FadeUp>
    );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 space-y-4 animate-pulse">
            <div className="flex justify-between">
                <div className="h-5 w-20 rounded-md bg-stone-100 dark:bg-zinc-800" />
                <div className="h-5 w-16 rounded-md bg-stone-100 dark:bg-zinc-800" />
            </div>
            <div className="space-y-2">
                <div className="h-3.5 bg-stone-100 dark:bg-zinc-800 rounded w-full" />
                <div className="h-3.5 bg-stone-100 dark:bg-zinc-800 rounded w-5/6" />
                <div className="h-3.5 bg-stone-100 dark:bg-zinc-800 rounded w-4/6" />
            </div>
            <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex justify-between">
                <div className="h-3 w-20 rounded bg-stone-100 dark:bg-zinc-800" />
                <div className="h-5 w-5 rounded-full bg-stone-100 dark:bg-zinc-800" />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemoryPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                const token = getToken();
                if (!token) throw new Error("Not authenticated");
                setMemories(await fetchMeMemories(token));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load memories");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Counts per tag for filter tabs
    const counts = useMemo(() => {
        const c: Record<string, number> = { All: memories.length };
        memories.forEach(m => {
            const { tag } = parseMemoryText(m.text);
            const label = tag ? (TAG_CONFIG[tag]?.label ?? "Memory") : "Memory";
            c[label] = (c[label] ?? 0) + 1;
        });
        return c;
    }, [memories]);

    // Filtered + searched list
    const shown = useMemo(() => {
        return memories.filter(m => {
            const { tag, body } = parseMemoryText(m.text);
            const label = tag ? (TAG_CONFIG[tag]?.label ?? "Memory") : "Memory";

            const matchesFilter = activeFilter === "All" || label === activeFilter;
            const matchesSearch = search.trim() === "" ||
                body.toLowerCase().includes(search.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [memories, activeFilter, search]);

    return (
        <div className="min-h-full bg-stone-50 dark:bg-zinc-950 p-6 lg:p-8 space-y-8 transition-colors duration-200">

            {/* ── Header ── */}
            <FadeUp>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                            Client Memory
                        </h1>
                        <p className="text-sm font-medium text-stone-500 dark:text-zinc-400 mt-1.5">
                            Automated context your twin has extracted from conversations
                        </p>
                    </div>

                    {/* Total count badge */}
                    {!loading && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl
              border border-stone-200 bg-white shadow-sm
              dark:border-zinc-800 dark:bg-zinc-900">
                            <Brain size={14} className="text-violet-600 dark:text-violet-400" />
                            <span className="text-sm font-bold text-stone-900 dark:text-white">
                                {memories.length}
                            </span>
                            <span className="text-xs font-semibold text-stone-400 dark:text-zinc-500">
                                memories stored
                            </span>
                        </div>
                    )}
                </div>
            </FadeUp>

            {/* ── Search + Filters ── */}
            {!loading && !error && memories.length > 0 && (
                <FadeUp delay={0.08}>
                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* Search */}
                        <div className="flex items-center gap-2.5 flex-1 max-w-sm
              px-4 py-2.5 rounded-xl
              border border-stone-200 bg-white shadow-sm
              dark:border-zinc-800 dark:bg-zinc-900
              focus-within:border-indigo-400 dark:focus-within:border-indigo-500
              transition-colors">
                            <Search size={14} className="text-stone-400 dark:text-zinc-500 shrink-0" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search memories..."
                                className="bg-transparent outline-none border-none w-full
                  text-sm font-medium placeholder-stone-400 dark:placeholder-zinc-500
                  text-stone-800 dark:text-zinc-100"
                            />
                            {search && (
                                <button onClick={() => setSearch("")}>
                                    <X size={13} className="text-stone-400 dark:text-zinc-500 hover:text-stone-600 dark:hover:text-zinc-300" />
                                </button>
                            )}
                        </div>

                        {/* Filter tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {FILTER_TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`
                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150
                    ${activeFilter === tab
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                                        }
                  `}
                                >
                                    {tab}
                                    {counts[tab] !== undefined && (
                                        <span className={`ml-1.5 ${activeFilter === tab ? "opacity-70" : "opacity-50"}`}>
                                            {counts[tab]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </FadeUp>
            )}

            {/* ── States ── */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {!loading && error && (
                <div className="text-sm font-semibold text-red-600 dark:text-red-400
          border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5
          rounded-xl px-4 py-3">
                    ✗ {error}
                </div>
            )}

            {!loading && !error && memories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-zinc-800
            flex items-center justify-center">
                        <Brain size={20} className="text-stone-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-sm font-semibold text-stone-500 dark:text-zinc-400">
                        No memories yet
                    </p>
                    <p className="text-xs font-medium text-stone-400 dark:text-zinc-500">
                        Start chatting or send a Telegram message to begin
                    </p>
                </div>
            )}

            {/* ── No search results ── */}
            {!loading && !error && memories.length > 0 && shown.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                    <p className="text-sm font-semibold text-stone-500 dark:text-zinc-400">
                        No memories match &ldquo;{search}&rdquo;
                    </p>
                    <button
                        onClick={() => { setSearch(""); setActiveFilter("All"); }}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* ── Memory Grid ── */}
            {!loading && !error && shown.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {shown.map((memory, i) => (
                        <MemoryCard key={memory.id} memory={memory} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}