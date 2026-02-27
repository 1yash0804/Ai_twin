"use client";

import { FadeUp } from "@/components/animation/MotionWrappers";
import { fetchMeActivities, fetchMeStats, type ActivityItem } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  Activity, Brain, CheckSquare, Clock,
  MessageSquare, Send, Zap, ArrowUpRight, Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type DashboardData = {
  messages_responded: number;
  tasks_extracted: number;
  memories_created: number;
};

// ─── Helpers (untouched) ──────────────────────────────────────────────────────

function cleanActivityText(text: string): string {
  let t = text.replace(/^(user|assistant):\s*/i, "");
  t = t.replace(/^\[From [^\]]+\]\s*/i, "");
  t = t.replace(/^\[[A-Z_]+\]\s*/, "");
  return t.trim();
}
function getActivityMeta(item: ActivityItem): string {
  const match = item.text.match(/^\[From ([^\]]+)\]/i);
  if (match) return match[1];
  if (item.source === "telegram") return "Telegram";
  if (item.source === "manual") return "Manual";
  return item.source || "System";
}
function getMemoryTag(text: string): string | null {
  const match = text.match(/^\[([A-Z_]+)\]/);
  return match ? match[1].replace("_", " ") : null;
}
function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) return;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, loading]);

  if (loading) return <span className="inline-block w-16 h-10 rounded-lg bg-stone-200 dark:bg-zinc-700/40 animate-pulse" />;
  return <>{display.toLocaleString()}</>;
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function MiniSparkline({ accent }: { accent: string }) {
  const points = [40, 28, 45, 32, 55, 42, 60, 48, 70, 52, 78].map(
    (y, x) => `${x * 10},${80 - y}`
  ).join(" ");
  const colorMap: Record<string, string> = {
    emerald: "#10b981", blue: "#3b82f6", violet: "#8b5cf6", amber: "#f59e0b",
  };
  return (
    <svg width="110" height="32" viewBox="0 0 100 80" preserveAspectRatio="none" className="opacity-50">
      <polyline points={points} fill="none" stroke={colorMap[accent] ?? "#10b981"}
        strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Accent map ───────────────────────────────────────────────────────────────

const ACCENT = {
  emerald: {
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/25",
    glow: "hover:shadow-emerald-500/10",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    hoverWash: "group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-500/5",
  },
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/25",
    glow: "hover:shadow-blue-500/10",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    hoverWash: "group-hover:bg-blue-50/50 dark:group-hover:bg-blue-500/5",
  },
  violet: {
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/25",
    glow: "hover:shadow-violet-500/10",
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    hoverWash: "group-hover:bg-violet-50/50 dark:group-hover:bg-violet-500/5",
  },
  amber: {
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/25",
    glow: "hover:shadow-amber-500/10",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    hoverWash: "group-hover:bg-amber-50/50 dark:group-hover:bg-amber-500/5",
  },
} as const;

// ─── Stat Card ────────────────────────────────────────────────────────────────

type StatCard = {
  title: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  delta?: string;
};

function StatCard({ card, loading }: { card: StatCard; loading: boolean }) {
  const Icon = card.icon;
  const a = ACCENT[card.accent as keyof typeof ACCENT] ?? ACCENT.emerald;

  return (
    <div className={`
      group relative rounded-2xl overflow-hidden cursor-default
      p-5 flex flex-col justify-between gap-5
      bg-white dark:bg-zinc-900
      border ${a.border}
      hover:shadow-xl ${a.glow}
      transition-all duration-300
    `}>
      {/* hover wash */}
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${a.hoverWash}`} />

      <div className="relative flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl ${a.iconBg} border ${a.border} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${a.text}`} />
        </div>
        <MiniSparkline accent={card.accent} />
      </div>

      <div className="relative">
        {/* Label — visible, weighted */}
        <p className="text-[11px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-1.5">
          {card.title}
        </p>
        {/* Number — the hero */}
        <p className="text-[2.6rem] font-extrabold tracking-tight leading-none text-stone-900 dark:text-white font-mono">
          <AnimatedNumber value={card.value} loading={loading} />
        </p>
        {card.delta && (
          <div className="flex items-center gap-1 mt-2.5">
            <ArrowUpRight className={`w-3.5 h-3.5 ${a.text}`} />
            <span className={`text-xs font-semibold ${a.text}`}>{card.delta}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Source Icon ──────────────────────────────────────────────────────────────

function SourceIcon({ source, type }: { source: string; type: string }) {
  if (source === "telegram")
    return (
      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center shrink-0">
        <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      </div>
    );
  if (type === "memory")
    return (
      <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center shrink-0">
        <Brain className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shrink-0">
      <CheckSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.replace("/login"); return; }
    const loadData = async () => {
      try {
        setError(null);
        const [statsRes, activitiesRes] = await Promise.all([
          fetchMeStats(token),
          fetchMeActivities(token),
        ]);
        setStats(statsRes);
        setActivities(activitiesRes.slice(0, 8));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [router]);

  const cards = useMemo<StatCard[]>(
    () => [
      { title: "Messages Responded", value: stats?.messages_responded ?? 0, icon: MessageSquare, accent: "blue", delta: "all time" },
      { title: "Tasks Extracted", value: stats?.tasks_extracted ?? 0, icon: Clock, accent: "amber", delta: "auto-detected" },
      { title: "Memories Captured", value: stats?.memories_created ?? 0, icon: Brain, accent: "violet", delta: "stored context" },
      { title: "Recent Activities", value: activities.length, icon: Activity, accent: "emerald", delta: "this session" },
    ],
    [stats, activities.length],
  );

  return (
    <div className="min-h-full bg-stone-50 dark:bg-zinc-950 p-6 lg:p-8 space-y-8 transition-colors duration-200">

      {/* ── Header ── */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                live · {time}
              </span>
            </div>
            {/* Page title — sharp, heavy */}
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              Operational Snapshot
            </h1>
            {/* Subtitle — readable but secondary */}
            <p className="text-sm font-medium text-stone-500 dark:text-zinc-400 mt-1.5">
              Live data from your connected backend services
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold
            border border-stone-200 bg-white text-stone-600
            dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300
            shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            API connected
          </div>
        </div>
      </FadeUp>

      {error && (
        <div className="text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 rounded-xl px-4 py-3">
          ✗ {error}
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <FadeUp key={card.title} delay={i * 0.07}>
            <StatCard card={card} loading={loading} />
          </FadeUp>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Activity Feed */}
        <div className="xl:col-span-2 flex flex-col gap-3">
          <FadeUp delay={0.28}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-stone-800 dark:text-white">
                  Recent Activities
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[11px] font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-wider">
                last 8 events
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.34}>
            <div className="rounded-2xl overflow-hidden
              border border-stone-200 bg-white shadow-sm
              dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none
              divide-y divide-stone-100 dark:divide-zinc-800/60">

              {loading && (
                <div className="p-5 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-zinc-800 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-stone-100 dark:bg-zinc-800 rounded animate-pulse"
                          style={{ width: `${60 + i * 7}%` }} />
                        <div className="h-2.5 bg-stone-100 dark:bg-zinc-800/60 rounded animate-pulse w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && activities.length === 0 && (
                <div className="p-10 text-center space-y-2">
                  <Sparkles className="w-5 h-5 text-stone-300 dark:text-zinc-700 mx-auto" />
                  <p className="text-sm font-medium text-stone-400 dark:text-zinc-500">
                    No activities yet — send a Telegram message to begin
                  </p>
                </div>
              )}

              {!loading && activities.map((item, idx) => {
                const cleanText = cleanActivityText(item.text);
                const meta = getActivityMeta(item);
                const tag = item.type === "memory" ? getMemoryTag(item.text) : null;

                if (
                  item.type === "memory" &&
                  (item.text.startsWith("user:") || item.text.startsWith("assistant:"))
                ) return null;

                return (
                  <div key={item.id} className={`
                    group px-4 py-3.5 flex items-center justify-between gap-4
                    hover:bg-stone-50 dark:hover:bg-zinc-800/50
                    transition-colors duration-150
                    ${idx === 0
                      ? "bg-emerald-50/80 border-l-[3px] border-l-emerald-500 dark:bg-emerald-500/[0.06] dark:border-l-emerald-500/60"
                      : ""}
                  `}>
                    <div className="flex items-center gap-3 min-w-0">
                      <SourceIcon source={item.source} type={item.type} />
                      <div className="min-w-0">
                        {/* Activity text — must be clearly readable */}
                        <p className="text-sm font-semibold text-stone-800 dark:text-zinc-100 truncate">
                          {cleanText || "Activity recorded"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {tag && (
                            <span className="text-[9px] font-bold uppercase tracking-widest
                              bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400
                              px-1.5 py-0.5 rounded border border-violet-200 dark:border-violet-500/20">
                              {tag}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold uppercase tracking-wide
                            text-stone-400 dark:text-zinc-500">
                            {meta}
                          </span>
                          <span className="w-0.5 h-0.5 rounded-full bg-stone-300 dark:bg-zinc-700" />
                          <span className="text-[11px] font-medium text-stone-400 dark:text-zinc-500">
                            {formatTime(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`
                      shrink-0 px-2.5 py-1 rounded-md border font-bold text-[10px] uppercase tracking-widest
                      ${item.type === "memory"
                        ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"}
                    `}>
                      {item.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Backend status */}
          <FadeUp delay={0.38}>
            <div>
              <h3 className="text-base font-bold text-stone-800 dark:text-white mb-3">
                Backend Status
              </h3>
              <div className="rounded-2xl p-5 space-y-5 shadow-sm
                border border-stone-200 bg-white
                dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
                    Integration Live
                  </p>
                </div>

                <p className="text-lg font-bold leading-snug text-stone-900 dark:text-white">
                  {stats ? (
                    <>
                      {stats.messages_responded.toLocaleString()}{" "}
                      <span className="text-stone-400 dark:text-zinc-500 font-normal text-base">
                        responses generated
                      </span>
                    </>
                  ) : (
                    <span className="text-stone-400 dark:text-zinc-500 font-normal">Connecting…</span>
                  )}
                </p>

                <div className="border-t pt-4 space-y-3 border-stone-100 dark:border-zinc-800">
                  {[
                    { label: "Tasks extracted", val: stats?.tasks_extracted },
                    { label: "Memories captured", val: stats?.memories_created },
                    { label: "API status", badge: "Authenticated" },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
                        {row.label}
                      </span>
                      {"badge" in row ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md
                          bg-emerald-50 text-emerald-700 border border-emerald-200
                          dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20">
                          {row.badge}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-stone-800 dark:text-zinc-200">
                          {row.val ?? "—"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Pro tip */}
          <FadeUp delay={0.44}>
            <div className="rounded-2xl p-5 space-y-3 relative overflow-hidden
              border border-amber-200 bg-amber-50
              dark:border-zinc-700/50 dark:bg-gradient-to-br dark:from-zinc-800/60 dark:to-zinc-900">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full
                bg-amber-300/30 dark:bg-amber-400/10 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                  Pro tip
                </p>
              </div>
              <p className="text-sm font-medium leading-relaxed text-amber-900 dark:text-zinc-300">
                Add your bot to a Telegram group to silently extract tasks from real conversations.
              </p>
            </div>
          </FadeUp>

        </div>
      </div>
    </div>
  );
}