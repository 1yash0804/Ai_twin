"use client";

import { FadeUp } from "@/components/animation/MotionWrappers";
import { fetchTelegramOverview, type TelegramOverviewResponse } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Send, ArrowRight, CheckSquare, Brain,
  Zap, Clock, AlertCircle, RefreshCw,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function parseRawPayload(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return (
      parsed?.message?.text ||
      parsed?.text ||
      parsed?.message?.caption ||
      raw.slice(0, 120)
    );
  } catch {
    return raw.slice(0, 120);
  }
}

function parseMemoryText(text: string): { tag: string | null; body: string } {
  const match = text.match(/^\[([A-Z_]+)\]\s*([\s\S]+)/);
  if (match) return { tag: match[1].replace("_", " "), body: match[2] };
  return { tag: null, body: text };
}

const PRIORITY_STYLE = {
  high: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  low: "bg-stone-100 text-stone-500 border-stone-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700",
};

const TAG_STYLE: Record<string, string> = {
  "GOAL": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  "PREFERENCE": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "COMMITMENT": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  "PERSONAL FACT": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-stone-100 dark:border-zinc-800 p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-stone-100 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-12 bg-stone-100 dark:bg-zinc-800 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-stone-100 dark:bg-zinc-800 rounded w-full" />
        <div className="h-3.5 bg-stone-100 dark:bg-zinc-800 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── Column shell ─────────────────────────────────────────────────────────────

function PipelineColumn({
  icon, label, count, accent, loading, children, emptyText,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  accent: string;
  loading: boolean;
  children: React.ReactNode;
  emptyText: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border overflow-hidden
      border-stone-200 bg-white shadow-sm
      dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">

      {/* Column header */}
      <div className="px-5 py-4 border-b flex items-center justify-between
        border-stone-100 bg-stone-50/60
        dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent}`}>
            {icon}
          </div>
          <span className="text-sm font-bold text-stone-800 dark:text-zinc-100">{label}</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-md
          bg-stone-100 text-stone-500
          dark:bg-zinc-800 dark:text-zinc-400">
          {count}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto max-h-[520px] p-4 space-y-3">
        {loading && [...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        {!loading && count === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
            <p className="text-xs font-medium text-stone-400 dark:text-zinc-600">{emptyText}</p>
          </div>
        )}
        {!loading && children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TelegramDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<TelegramOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      setData(await fetchTelegramOverview(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Telegram data");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { void load(); }, [router]);

  const msgCount = data?.messages.length ?? 0;
  const taskCount = data?.tasks.length ?? 0;
  const memCount = data?.memories.length ?? 0;

  // Pipeline yield — what % of messages produced something useful
  const yieldPct = msgCount > 0
    ? Math.round(((taskCount + memCount) / msgCount) * 100)
    : 0;

  return (
    <div className="min-h-full bg-stone-50 dark:bg-zinc-950 p-6 lg:p-8 space-y-8 transition-colors duration-200">

      {/* ── Header ── */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/20
                flex items-center justify-center">
                <Send size={11} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]
                text-stone-400 dark:text-zinc-500">
                Telegram Integration
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              Extraction Pipeline
            </h1>
            <p className="text-sm font-medium text-stone-500 dark:text-zinc-400 mt-1.5 max-w-lg">
              Every message your bot receives gets processed here — tasks and memories are automatically extracted and stored for your AI twin.
            </p>
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold
              border border-stone-200 bg-white text-stone-600 shadow-sm
              hover:border-stone-300 hover:text-stone-900
              dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400
              dark:hover:border-zinc-700 dark:hover:text-zinc-200
              disabled:opacity-50 transition-all"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </FadeUp>

      {error && (
        <div className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400
          border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5
          rounded-xl px-4 py-3">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* ── Pipeline stats ── */}
      <FadeUp delay={0.07}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Messages received",
              value: msgCount,
              icon: <Send size={14} />,
              style: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
            },
            {
              label: "Tasks extracted",
              value: taskCount,
              icon: <CheckSquare size={14} />,
              style: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
            },
            {
              label: "Memories created",
              value: memCount,
              icon: <Brain size={14} />,
              style: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
            },
            {
              label: "Pipeline yield",
              value: `${yieldPct}%`,
              icon: <Zap size={14} />,
              style: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border p-4
              bg-white border-stone-200 shadow-sm
              dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-none">
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center mb-3 ${s.bg} ${s.style}`}>
                {s.icon}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em]
                text-stone-400 dark:text-zinc-500 mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-extrabold font-mono tracking-tight
                text-stone-900 dark:text-white">
                {loading ? (
                  <span className="inline-block w-10 h-7 bg-stone-100 dark:bg-zinc-800 rounded animate-pulse" />
                ) : s.value}
              </p>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* ── How it works banner (shown when empty) ── */}
      {!loading && msgCount === 0 && (
        <FadeUp delay={0.1}>
          <div className="rounded-2xl border p-6 space-y-4
            border-indigo-200 bg-indigo-50/60
            dark:border-indigo-500/20 dark:bg-indigo-500/5">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
              🚀 Your pipeline is ready — no messages yet
            </p>
            <p className="text-sm font-medium text-indigo-600/80 dark:text-indigo-400/70 leading-relaxed">
              Once your Telegram bot receives a message, it automatically appears here. Your AI twin will extract tasks, deadlines, and context from every conversation — silently, in the background.
            </p>
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              {["Message arrives", "AI processes it", "Tasks extracted", "Memory updated"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-white dark:bg-zinc-900
                    border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-lg">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <ArrowRight size={12} className="text-indigo-400 dark:text-indigo-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {/* ── Pipeline flow label ── */}
      {(loading || msgCount > 0) && (
        <FadeUp delay={0.12}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest
              text-stone-400 dark:text-zinc-500">
              Pipeline flow
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { color: "bg-blue-400", label: "Messages" },
                { color: "bg-amber-400", label: "Tasks" },
                { color: "bg-violet-400", label: "Memories" },
              ].map((s, i, arr) => (
                <span key={s.label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400">{s.label}</span>
                  {i < arr.length - 1 && <ArrowRight size={10} className="text-stone-300 dark:text-zinc-700 mx-0.5" />}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      )}

      {/* ── Three columns ── */}
      <FadeUp delay={0.15}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Messages */}
          <PipelineColumn
            icon={<Send size={13} className="text-blue-600 dark:text-blue-400" />}
            label="Raw Messages"
            count={msgCount}
            accent="bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20"
            loading={loading}
            emptyText="No messages received yet"
          >
            {data?.messages.map((msg, i) => {
              const text = parseRawPayload(msg.raw_payload);
              return (
                <div key={msg.id}
                  className="rounded-xl border p-4 space-y-2 transition-colors
                    border-stone-100 bg-stone-50/50 hover:bg-white hover:border-stone-200
                    dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:bg-zinc-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest
                      px-1.5 py-0.5 rounded border
                      bg-blue-50 text-blue-700 border-blue-200
                      dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                      incoming
                    </span>
                    <span className="text-[10px] font-medium text-stone-400 dark:text-zinc-500 flex items-center gap-1">
                      <Clock size={9} />
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug text-stone-800 dark:text-zinc-200 break-words">
                    {text}
                  </p>
                </div>
              );
            })}
          </PipelineColumn>

          {/* Tasks */}
          <PipelineColumn
            icon={<CheckSquare size={13} className="text-amber-600 dark:text-amber-400" />}
            label="Extracted Tasks"
            count={taskCount}
            accent="bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20"
            loading={loading}
            emptyText="No tasks extracted yet — tasks are automatically detected from messages"
          >
            {data?.tasks.map((task) => {
              const pct = Math.round(task.confidence_score * 100);
              const prio = task.priority as keyof typeof PRIORITY_STYLE;
              const barColor = pct >= 80 ? "bg-emerald-500" : pct >= 55 ? "bg-amber-500" : "bg-rose-500";
              return (
                <div key={task.id}
                  className="rounded-xl border p-4 space-y-3 transition-colors
                    border-stone-100 bg-stone-50/50 hover:bg-white hover:border-stone-200
                    dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:bg-zinc-800">
                  {/* Title */}
                  <p className="text-sm font-bold leading-snug text-stone-900 dark:text-zinc-100">
                    {task.title ?? task.description}
                  </p>
                  {task.title && task.description && (
                    <p className="text-xs font-medium text-stone-500 dark:text-zinc-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${PRIORITY_STYLE[prio] ?? PRIORITY_STYLE.medium}`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="text-[10px] font-semibold text-stone-400 dark:text-zinc-500 flex items-center gap-1">
                        <Clock size={9} /> {task.due_date}
                      </span>
                    )}
                  </div>
                  {/* Confidence */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-600">
                        AI confidence
                      </span>
                      <span className="text-[10px] font-bold text-stone-600 dark:text-zinc-400 font-mono">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-stone-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all duration-700`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </PipelineColumn>

          {/* Memories */}
          <PipelineColumn
            icon={<Brain size={13} className="text-violet-600 dark:text-violet-400" />}
            label="Created Memories"
            count={memCount}
            accent="bg-violet-50 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20"
            loading={loading}
            emptyText="No memories stored yet — context is extracted automatically from conversations"
          >
            {data?.memories.map((memory) => {
              const { tag, body } = parseMemoryText(memory.text);
              const tagStyle = tag ? (TAG_STYLE[tag] ?? TAG_STYLE["GOAL"]) : "";
              return (
                <div key={memory.id}
                  className="rounded-xl border p-4 space-y-2.5 transition-colors
                    border-stone-100 bg-stone-50/50 hover:bg-white hover:border-stone-200
                    dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:bg-zinc-800">
                  <div className="flex items-center justify-between gap-2">
                    {tag ? (
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${tagStyle}`}>
                        {tag}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border
                        bg-stone-100 text-stone-500 border-stone-200
                        dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700">
                        memory
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-stone-400 dark:text-zinc-500 flex items-center gap-1">
                      <Clock size={9} />
                      {formatTime(memory.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-stone-800 dark:text-zinc-200">
                    &ldquo;{body}&rdquo;
                  </p>
                </div>
              );
            })}
          </PipelineColumn>

        </div>
      </FadeUp>
    </div>
  );
}