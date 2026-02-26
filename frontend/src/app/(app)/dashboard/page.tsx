"use client";

import { FadeUp } from "@/components/animation/MotionWrappers";
import { fetchMeActivities, fetchMeStats, type ActivityItem } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  Activity,
  Brain,
  CheckSquare,
  Clock,
  MessageSquare,
  Send,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DashboardData = {
  messages_responded: number;
  tasks_extracted: number;
  memories_created: number;
};

// ─── Text Cleanup Helpers ─────────────────────────────────────────────────────

function cleanActivityText(text: string): string {
  // Remove "user: " or "assistant: " prefix
  let t = text.replace(/^(user|assistant):\s*/i, "");
  // Remove [From X in Y] or [From X] context label
  t = t.replace(/^\[From [^\]]+\]\s*/i, "");
  // Remove [TAG] prefix like [GOAL], [PREFERENCE] etc
  t = t.replace(/^\[[A-Z_]+\]\s*/, "");
  return t.trim();
}

function getActivityMeta(item: ActivityItem): string {
  // Extract sender name from [From X in Y] pattern
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

// ─── Source Icon ──────────────────────────────────────────────────────────────

function SourceIcon({ source, type }: { source: string; type: string }) {
  if (source === "telegram")
    return (
      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
        <Send className="w-4 h-4 text-blue-500" />
      </div>
    );
  if (type === "memory")
    return (
      <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
        <Brain className="w-4 h-4 text-violet-500" />
      </div>
    );
  return (
    <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
      <CheckSquare className="w-4 h-4 text-amber-500" />
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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const loadData = async () => {
      try {
        setError(null);
        const [statsResponse, activitiesResponse] = await Promise.all([
          fetchMeStats(token),
          fetchMeActivities(token),
        ]);
        setStats(statsResponse);
        setActivities(activitiesResponse.slice(0, 8));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [router]);

  const cards = useMemo(
    () => [
      {
        title: "Messages Responded",
        value: stats?.messages_responded ?? 0,
        icon: MessageSquare,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
      },
      {
        title: "Tasks Extracted",
        value: stats?.tasks_extracted ?? 0,
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
      },
      {
        title: "Memories Captured",
        value: stats?.memories_created ?? 0,
        icon: Brain,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
      },
      {
        title: "Recent Activities",
        value: activities.length,
        icon: Activity,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
      },
    ],
    [stats, activities.length],
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 bg-slate-100 min-h-full">
      <FadeUp>
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Operational Snapshot
          </h1>
          <p className="text-base text-slate-500 font-medium">
            Live data from your connected backend services.
          </p>
        </div>
      </FadeUp>

      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((stat, i) => (
          <FadeUp key={stat.title} delay={i * 0.08}>
            <div className={`bg-white border ${stat.border} p-6 rounded-3xl shadow-sm`}>
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {loading ? "..." : stat.value}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Activity Feed */}
        <div className="xl:col-span-2 space-y-4">
          <FadeUp delay={0.3}>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight px-1">
              Recent Activities
            </h3>
          </FadeUp>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-50">
            {loading && (
              <div className="p-6 text-sm font-medium text-slate-400">Loading...</div>
            )}
            {!loading && activities.length === 0 && (
              <div className="p-6 text-sm font-medium text-slate-400">
                No activities yet. Send a Telegram message to get started.
              </div>
            )}
            {!loading &&
              activities.map((item) => {
                const cleanText = cleanActivityText(item.text);
                const meta = getActivityMeta(item);
                const tag = item.type === "memory" ? getMemoryTag(item.text) : null;

                // Skip raw assistant/user message memories — show only extracted ones
                if (
                  item.type === "memory" &&
                  (item.text.startsWith("user:") || item.text.startsWith("assistant:"))
                ) return null;

                return (
                  <div
                    key={item.id}
                    className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <SourceIcon source={item.source} type={item.type} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {cleanText || "Activity recorded"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {tag && (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            {meta}
                          </span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {formatTime(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.type === "memory"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-amber-50 text-amber-600"
                        }`}
                    >
                      {item.type}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Backend Status */}
        <div className="space-y-4">
          <FadeUp delay={0.4}>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight px-1">
              Backend Status
            </h3>
          </FadeUp>
          <div className="bg-white border border-indigo-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                Integration Live
              </p>
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-tight">
              {stats
                ? `${stats.messages_responded} responses generated by AI Twin.`
                : "Connecting to backend..."}
            </p>
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Tasks extracted</span>
                <span className="text-xs font-bold text-slate-900">{stats?.tasks_extracted ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Memories captured</span>
                <span className="text-xs font-bold text-slate-900">{stats?.memories_created ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">API status</span>
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                  Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-indigo-600 p-6 rounded-3xl text-white space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Pro tip</p>
            </div>
            <p className="text-sm font-semibold leading-relaxed opacity-90">
              Add your bot to a Telegram group to silently extract tasks from real conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}