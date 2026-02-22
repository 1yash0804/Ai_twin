"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { CheckCircle2, Clock, AlertCircle, MessageSquare } from "lucide-react";

const stats = [
    { title: "Active Commitments", value: "24", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { title: "Due Today", value: "6", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { title: "High Priority", value: "3", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { title: "Awaiting Follow-up", value: "12", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
];

export default function DashboardOverview() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-10 bg-slate-100 min-h-full">
            <FadeUp>
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Operational Snapshot</h1>
                    <p className="text-base text-slate-500 font-medium">Monitoring activity across your connected chat threads.</p>
                </div>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                    <FadeUp key={i} delay={i * 0.08}>
                        <div className={`bg-white border ${stat.border} p-6 rounded-3xl group hover:border-indigo-600/40 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-indigo-600/5 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <stat.icon size={80} className={stat.color} strokeWidth={1} />
                            </div>
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] relative z-10">{stat.title}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2 relative z-10">{stat.value}</p>
                        </div>
                    </FadeUp>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <FadeUp delay={0.4}>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight px-2">Recent Transformations</h3>
                    </FadeUp>
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm shadow-slate-200/40 divide-y divide-slate-100">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                        {i === 1 ? "AD" : i === 2 ? "SK" : "MJ"}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {i === 1 ? "Sent proposal to Aditya" : i === 2 ? "Finalize contract for Sarah" : "Review roadmap for Mark"}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                                            <span>WhatsApp</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span>14m ago</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    Processing
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <FadeUp delay={0.5}>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight px-2">Live Status</h3>
                    </FadeUp>
                    <div className="bg-white border border-indigo-200 p-6 sm:p-8 rounded-3xl text-slate-900 shadow-lg shadow-indigo-600/10 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-indigo-600">Extraction Active</p>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 leading-tight">472 messages processed today.</p>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_12px_rgba(79,70,229,0.5)]" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Awaiting new data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
