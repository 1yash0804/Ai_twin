"use client";

import { FadeUp } from "@/components/animation/MotionWrappers";
import { fetchMeActivities, fetchMeStats, type ActivityItem } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Activity, AlertCircle, Brain, Clock, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type DashboardData = {
  messages_responded: number;
  tasks_extracted: number;
  memories_created: number;
};

const iconByType = {
  memory: Brain,
  task: Activity,
};

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
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Operational Snapshot</h1>
          <p className="text-base text-slate-500 font-medium">Live data from your connected backend services.</p>
        </div>
      </FadeUp>

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((stat, i) => (
          <FadeUp key={stat.title} delay={i * 0.08}>
            <div className={`bg-white border ${stat.border} p-6 rounded-3xl shadow-sm relative overflow-hidden`}>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">{loading ? "..." : stat.value}</p>
            </div>
          </FadeUp>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2 space-y-6">
          <FadeUp delay={0.3}>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight px-2">Recent Activities</h3>
          </FadeUp>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm shadow-slate-200/40 divide-y divide-slate-100">
            {activities.length === 0 && !loading ? (
              <div className="p-6 text-sm font-medium text-slate-500">No activities yet. Start chatting or processing docs.</div>
            ) : (
              activities.map((item) => {
                const Icon = iconByType[item.type] ?? Activity;
                return (
                  <div key={item.id} className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900">{item.text}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                          <span>{item.source}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {item.type}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <FadeUp delay={0.4}>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight px-2">Backend Status</h3>
          </FadeUp>
          <div className="bg-white border border-indigo-200 p-6 sm:p-8 rounded-3xl text-slate-900 shadow-lg shadow-indigo-600/10 relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-indigo-600">Integration Live</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 leading-tight">
              {stats ? `${stats.messages_responded} responses generated by AI Twin.` : "Connecting to backend..."}
            </p>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Authenticated API sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
