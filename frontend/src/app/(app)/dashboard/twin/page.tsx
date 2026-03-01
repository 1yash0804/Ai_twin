"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import {
    fetchMeStats,
    fetchMeMemories,
    fetchMeTasks,
    chatWithTwin,
    type Memory,
    type Task,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
    Brain, Zap, MessageSquare, ChevronRight,
    Sparkles, User, Bot, Send, Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMemoryTag(text: string): { tag: string; body: string } {
    const match = text.match(/^\[([A-Z_]+)\]\s*([\s\S]+)/);
    if (match) return { tag: match[1].replace("_", " "), body: match[2] };
    return { tag: "MEMORY", body: text };
}

const TAG_COLORS: Record<string, string> = {
    "GOAL": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    "PREFERENCE": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    "COMMITMENT": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    "PERSONAL FACT": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    "MEMORY": "bg-stone-100 text-stone-600 border-stone-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

const STARTER_PROMPTS = [
    "What tasks do I have pending this week?",
    "What do you know about my preferences?",
    "Summarize my recent commitments",
    "What should I focus on today?",
    "What have you learned about how I work?",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TwinPage() {
    const router = useRouter();
    const token = getToken() ?? "";

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState({ messages_responded: 0, tasks_extracted: 0, memories_created: 0 });
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("you");

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Load data
    useEffect(() => {
        if (!token) { router.replace("/login"); return; }

        const stored = localStorage.getItem("username");
        if (stored) setUsername(stored);

        Promise.all([
            fetchMeStats(token),
            fetchMeMemories(token),
            fetchMeTasks(token),
        ]).then(([s, m, t]) => {
            setStats(s);
            setMemories(m.slice(0, 8));
            setTasks(t.filter(t => t.status === "pending").slice(0, 5));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [router, token]);

    // Scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const query = (text ?? input).trim();
        if (!query || sending) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: query,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setSending(true);

        try {
            const res = await chatWithTwin(token, query);
            const assistantMsg: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: res.response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Sorry, I ran into an issue. Try again in a moment.",
                timestamp: new Date(),
            }]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void sendMessage();
        }
    };

    const pendingCount = tasks.length;
    const matchScore = Math.min(60 + Math.floor(memories.length * 2.5), 95);

    return (
        <div className="min-h-full bg-stone-50 dark:bg-zinc-950 transition-colors duration-200">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">

                {/* ── Header ── */}
                <FadeUp>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/20
                flex items-center justify-center">
                                <Brain size={11} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]
                text-stone-400 dark:text-zinc-500">
                                AI Twin
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white mb-1">
                            Your Digital Twin
                        </h1>
                        <p className="text-sm font-medium text-stone-500 dark:text-zinc-400 max-w-xl">
                            Trained on your conversations, tasks, and memories. Ask it anything about
                            your work — it knows your context, your style, your commitments.
                        </p>
                    </div>
                </FadeUp>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

                    {/* ── Left: Chat ── */}
                    <div className="flex flex-col gap-4">

                        {/* Twin identity card */}
                        <FadeUp delay={0.05}>
                            <div className="rounded-2xl border bg-white dark:bg-zinc-900
                border-stone-200 dark:border-zinc-800 p-5
                flex items-center gap-5">
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br
                    from-indigo-500 to-violet-600
                    flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <span className="text-white text-xl font-bold">
                                            {username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full
                    bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-base font-bold text-stone-900 dark:text-white">
                                            {username}&apos;s AI Twin
                                        </p>
                                        <span className="text-[9px] font-bold uppercase tracking-widest
                      px-1.5 py-0.5 rounded border
                      bg-indigo-50 text-indigo-700 border-indigo-200
                      dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                                            active
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-stone-400 dark:text-zinc-500">
                                        Knows your tasks, memories, preferences, and commitments
                                    </p>
                                </div>

                                {/* Personality match */}
                                <div className="text-right shrink-0">
                                    <p className="text-2xl font-bold text-stone-900 dark:text-white">
                                        {loading ? "—" : `${matchScore}%`}
                                    </p>
                                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                                        personality match
                                    </p>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Stats row */}
                        <FadeUp delay={0.08}>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Responses given", value: stats.messages_responded, icon: <MessageSquare size={13} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
                                    { label: "Tasks tracked", value: stats.tasks_extracted, icon: <Zap size={13} />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
                                    { label: "Memories stored", value: stats.memories_created, icon: <Brain size={13} />, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20" },
                                ].map((s) => (
                                    <div key={s.label} className="rounded-xl border p-4
                    bg-white border-stone-200
                    dark:bg-zinc-900 dark:border-zinc-800">
                                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center mb-3 ${s.bg} ${s.color}`}>
                                            {s.icon}
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em]
                      text-stone-400 dark:text-zinc-500 mb-1">
                                            {s.label}
                                        </p>
                                        <p className="text-2xl font-extrabold text-stone-900 dark:text-white">
                                            {loading ? (
                                                <span className="inline-block w-8 h-6 bg-stone-100 dark:bg-zinc-800 rounded animate-pulse" />
                                            ) : s.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>

                        {/* ── Chat window ── */}
                        <FadeUp delay={0.12}>
                            <div className="rounded-2xl border flex flex-col overflow-hidden
                bg-white border-stone-200 shadow-sm
                dark:bg-zinc-900 dark:border-zinc-800"
                                style={{ height: "480px" }}>

                                {/* Chat header */}
                                <div className="px-5 py-3.5 border-b flex items-center justify-between
                  border-stone-100 bg-stone-50/60
                  dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={13} className="text-indigo-500" />
                                        <span className="text-sm font-bold text-stone-800 dark:text-zinc-100">
                                            Chat with your twin
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                            online
                                        </span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                                    {/* Empty state */}
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10
                        border border-indigo-200 dark:border-indigo-500/20
                        flex items-center justify-center">
                                                <Brain size={22} className="text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-stone-800 dark:text-zinc-200 mb-1">
                                                    Your twin is ready
                                                </p>
                                                <p className="text-xs text-stone-400 dark:text-zinc-500 font-medium max-w-xs">
                                                    Ask about your tasks, commitments, or let it summarize what it knows about you.
                                                </p>
                                            </div>
                                            {/* Starter prompts */}
                                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                                                {STARTER_PROMPTS.slice(0, 3).map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => void sendMessage(p)}
                                                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg
                              border border-stone-200 bg-stone-50 text-stone-600
                              hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                              dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400
                              dark:hover:border-indigo-500/40 dark:hover:text-indigo-400
                              transition-all duration-150"
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Message list */}
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                {msg.role === "assistant" && (
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600
                            flex items-center justify-center shrink-0 mt-0.5">
                                                        <Bot size={13} className="text-white" />
                                                    </div>
                                                )}

                                                <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                                    ? "bg-indigo-600 text-white rounded-tr-sm"
                                                    : "bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                                                    }`}>
                                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                                        {msg.content}
                                                    </p>
                                                    <p className={`text-[9px] font-medium mt-1.5 ${msg.role === "user" ? "text-indigo-200" : "text-stone-400 dark:text-zinc-500"
                                                        }`}>
                                                        {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>

                                                {msg.role === "user" && (
                                                    <div className="w-7 h-7 rounded-lg bg-stone-200 dark:bg-zinc-700
                            flex items-center justify-center shrink-0 mt-0.5">
                                                        <User size={13} className="text-stone-600 dark:text-zinc-300" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {/* Typing indicator */}
                                    {sending && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3 justify-start"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600
                        flex items-center justify-center shrink-0">
                                                <Bot size={13} className="text-white" />
                                            </div>
                                            <div className="bg-stone-50 border border-stone-200 dark:bg-zinc-800 dark:border-zinc-700
                        rounded-2xl rounded-tl-sm px-4 py-3">
                                                <div className="flex gap-1.5 items-center h-4">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-zinc-500"
                                                            animate={{ y: [0, -4, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-stone-100 dark:border-zinc-800">
                                    <div className="flex gap-3 items-end">
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask your twin anything..."
                                            rows={1}
                                            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm font-medium
                        outline-none border transition-colors
                        bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400
                        focus:border-indigo-400 focus:bg-white
                        dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100
                        dark:placeholder-zinc-500 dark:focus:border-indigo-500
                        max-h-32 overflow-y-auto"
                                            style={{ minHeight: "44px" }}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => void sendMessage()}
                                            disabled={!input.trim() || sending}
                                            className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center
                        hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                        transition-colors shadow-md shadow-indigo-600/20 shrink-0"
                                        >
                                            <Send size={15} className="text-white" />
                                        </motion.button>
                                    </div>
                                    <p className="text-[10px] text-stone-400 dark:text-zinc-600 font-medium mt-2 text-center">
                                        Press Enter to send · Shift+Enter for new line
                                    </p>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Starter prompts below */}
                        {messages.length > 0 && (
                            <FadeUp delay={0.05}>
                                <div className="flex gap-2 flex-wrap">
                                    {STARTER_PROMPTS.slice(3).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => void sendMessage(p)}
                                            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg
                        border border-stone-200 bg-white text-stone-500
                        hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                        dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500
                        dark:hover:border-indigo-500/40 dark:hover:text-indigo-400
                        transition-all duration-150"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </FadeUp>
                        )}

                    </div>

                    {/* ── Right sidebar ── */}
                    <div className="flex flex-col gap-4">

                        {/* What your twin knows */}
                        <FadeUp delay={0.1}>
                            <div className="rounded-2xl border overflow-hidden
                bg-white border-stone-200
                dark:bg-zinc-900 dark:border-zinc-800">
                                <div className="px-5 py-4 border-b flex items-center gap-2
                  border-stone-100 bg-stone-50/60
                  dark:border-zinc-800 dark:bg-zinc-900">
                                    <Brain size={13} className="text-violet-600 dark:text-violet-400" />
                                    <span className="text-sm font-bold text-stone-800 dark:text-zinc-100">
                                        What your twin knows
                                    </span>
                                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-md
                    bg-stone-100 text-stone-500
                    dark:bg-zinc-800 dark:text-zinc-400">
                                        {memories.length}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2.5 max-h-[280px] overflow-y-auto">
                                    {loading && [...Array(4)].map((_, i) => (
                                        <div key={i} className="h-12 bg-stone-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                    ))}
                                    {!loading && memories.length === 0 && (
                                        <p className="text-xs text-stone-400 dark:text-zinc-600 font-medium text-center py-6">
                                            No memories yet — send messages via Telegram to build your twin&apos;s knowledge
                                        </p>
                                    )}
                                    {!loading && memories.map((m) => {
                                        const { tag, body } = parseMemoryTag(m.text);
                                        const tagStyle = TAG_COLORS[tag] ?? TAG_COLORS["MEMORY"];
                                        return (
                                            <div key={m.id} className="flex flex-col gap-1.5 p-3 rounded-xl
                        border border-stone-100 bg-stone-50/60
                        dark:border-zinc-800 dark:bg-zinc-800/40">
                                                <span className={`text-[8px] font-bold uppercase tracking-widest
                          px-1.5 py-0.5 rounded border self-start ${tagStyle}`}>
                                                    {tag}
                                                </span>
                                                <p className="text-xs font-semibold text-stone-700 dark:text-zinc-300 leading-snug">
                                                    {body}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </FadeUp>

                        {/* Pending tasks */}
                        <FadeUp delay={0.14}>
                            <div className="rounded-2xl border overflow-hidden
                bg-white border-stone-200
                dark:bg-zinc-900 dark:border-zinc-800">
                                <div className="px-5 py-4 border-b flex items-center gap-2
                  border-stone-100 bg-stone-50/60
                  dark:border-zinc-800 dark:bg-zinc-900">
                                    <Zap size={13} className="text-amber-600 dark:text-amber-400" />
                                    <span className="text-sm font-bold text-stone-800 dark:text-zinc-100">
                                        Pending tasks
                                    </span>
                                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-md
                    bg-stone-100 text-stone-500
                    dark:bg-zinc-800 dark:text-zinc-400">
                                        {pendingCount}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2">
                                    {loading && [...Array(3)].map((_, i) => (
                                        <div key={i} className="h-10 bg-stone-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                    ))}
                                    {!loading && tasks.length === 0 && (
                                        <p className="text-xs text-stone-400 dark:text-zinc-600 font-medium text-center py-4">
                                            No pending tasks
                                        </p>
                                    )}
                                    {!loading && tasks.map((t) => (
                                        <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl
                      border border-stone-100 bg-stone-50/60
                      dark:border-zinc-800 dark:bg-zinc-800/40">
                                            <div className="w-1.5 h-1.5 rounded-full shrink-0
                        bg-amber-500" />
                                            <p className="text-xs font-semibold text-stone-700 dark:text-zinc-300
                        leading-snug flex-1 truncate">
                                                {t.title ?? t.description}
                                            </p>
                                            {t.due_date && (
                                                <span className="text-[9px] font-medium text-stone-400 dark:text-zinc-500
                          flex items-center gap-1 shrink-0">
                                                    <Clock size={9} />
                                                    {t.due_date}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeUp>

                        {/* Twin capabilities */}
                        <FadeUp delay={0.18}>
                            <div className="rounded-2xl border p-5 space-y-4
                bg-gradient-to-br from-indigo-50 to-violet-50/40
                border-indigo-200
                dark:from-indigo-500/5 dark:to-violet-500/5
                dark:border-indigo-500/20">
                                <p className="text-xs font-bold uppercase tracking-widest
                  text-indigo-700 dark:text-indigo-400">
                                    Twin capabilities
                                </p>
                                <div className="space-y-2.5">
                                    {[
                                        "Remembers your preferences & style",
                                        "Knows all your pending commitments",
                                        "Understands your client context",
                                        "Answers in your voice and tone",
                                        "Gets smarter with every message",
                                    ].map((cap) => (
                                        <div key={cap} className="flex items-start gap-2">
                                            <ChevronRight size={12} className="text-indigo-500 mt-0.5 shrink-0" />
                                            <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                                                {cap}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeUp>

                    </div>
                </div>
            </div>
        </div>
    );
}