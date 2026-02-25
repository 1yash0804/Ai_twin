"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FadeUp, Stagger } from "@/components/animation/MotionWrappers";
import { Brain, MessageCircle, Send } from "lucide-react";
import { fetchMeMemories, type Memory } from "@/lib/api";
import { getToken } from "@/lib/auth";

// Maps memory source to a style + icon
const sourceConfig: Record<string, { icon: ReactNode; color: string; label: string }> = {
    telegram: {
        icon: <Send size={16} strokeWidth={2} />,
        color: "bg-blue-50 text-blue-500 group-hover:bg-blue-100",
        label: "Telegram",
    },
    chat: {
        icon: <MessageCircle size={16} strokeWidth={2} />,
        color: "bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100",
        label: "Chat",
    },
};

const fallbackSource = {
    icon: <Brain size={16} strokeWidth={2} />,
    color: "bg-slate-50 text-slate-400 group-hover:bg-slate-100",
    label: "System",
};

// Strip the [TYPE] prefix that telegram_processing adds, e.g. "[GOAL] lose weight"
function parseMemoryText(text: string): { tag: string | null; body: string } {
    const match = text.match(/^\[([A-Z_]+)\]\s*([\s\S]+)/);
    if (match) return { tag: match[1], body: match[2] };
    return { tag: null, body: text };
}

const tagColors: Record<string, string> = {
    GOAL: "bg-violet-50 text-violet-600",
    PREFERENCE: "bg-amber-50 text-amber-600",
    PERSONAL_FACT: "bg-emerald-50 text-emerald-600",
    COMMITMENT: "bg-rose-50 text-rose-600",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function MemoryPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) throw new Error("Not authenticated");
                const data = await fetchMeMemories(token);
                setMemories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load memories");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="p-10 space-y-16 bg-slate-50/50 min-h-full">
            {/* Header */}
            <FadeUp>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Memory</h1>
                    <p className="text-base text-slate-500 font-medium">
                        Automated context extracted from your conversations.
                    </p>
                </div>
            </FadeUp>

            {/* Loading */}
            {loading && (
                <div className="text-sm font-semibold text-slate-400 text-center py-20">
                    Loading memories...
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="text-sm font-semibold text-rose-500 text-center py-20">{error}</div>
            )}

            {/* Empty */}
            {!loading && !error && memories.length === 0 && (
                <div className="text-sm font-semibold text-slate-400 text-center py-20">
                    No memories yet. Start chatting or send a Telegram message.
                </div>
            )}

            {/* Memory grid */}
            {!loading && !error && memories.length > 0 && (
                <Stagger interval={0.05}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {memories.map((memory) => {
                            const { tag, body } = parseMemoryText(memory.text);
                            const src = sourceConfig[memory.source.toLowerCase()] ?? fallbackSource;

                            return (
                                <FadeUp key={memory.id}>
                                    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] group hover:border-indigo-600/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5 flex flex-col h-full">
                                        {/* Tag badge */}
                                        {tag && (
                                            <span
                                                className={`self-start px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 ${tagColors[tag] ?? "bg-slate-50 text-slate-400"
                                                    }`}
                                            >
                                                {tag.replace("_", " ")}
                                            </span>
                                        )}

                                        {/* Memory text */}
                                        <p className="text-base text-slate-700 leading-relaxed font-semibold flex-1 italic">
                                            &ldquo;{body}&rdquo;
                                        </p>

                                        {/* Footer */}
                                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${src.color}`}
                                            >
                                                {src.icon}
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {src.label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-400">
                                                {formatDate(memory.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </FadeUp>
                            );
                        })}
                    </div>
                </Stagger>
            )}
        </div>
    );
}