"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { History, Smartphone, Globe, MessageCircle } from "lucide-react";

const logs = [
    { id: 1, type: "WhatsApp", action: "Extracted commitment", meta: "From: Alex D.", time: "14m ago", status: "success" },
    { id: 2, type: "System", action: "Updated client memory", meta: "Target: Acme Corp", time: "2h ago", status: "success" },
    { id: 3, type: "WhatsApp", action: "Detected high-priority mention", meta: "Thread: Support #21", time: "4h ago", status: "warning" },
    { id: 4, type: "System", action: "Auto-synced dashboard", meta: "Ref: commit_821", time: "Yesterday", status: "success" },
];

export default function ActivityLogPage() {
    return (
        <div className="p-10 space-y-12 bg-slate-50/50 min-h-full">
            <FadeUp>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Extraction Log</h1>
                    <p className="text-base text-slate-500 font-medium">Real-time timeline of operational intelligence activity.</p>
                </div>
            </FadeUp>

            <div className="max-w-4xl space-y-8 pt-4">
                {logs.map((log, i) => (
                    <FadeUp key={i} delay={i * 0.08}>
                        <div className="relative pl-16 pb-12 last:pb-0">
                            {/* Timeline Border */}
                            <div className="absolute top-0 left-[27px] bottom-0 w-1 bg-slate-100" />

                            {/* Icon Node */}
                            <div className="absolute top-0 left-0 w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center z-10 shadow-sm group hover:border-indigo-100 transition-colors">
                                {log.type === "WhatsApp" ? (
                                    <MessageCircle size={22} className="text-indigo-600" strokeWidth={2} />
                                ) : (
                                    <History size={22} className="text-slate-400" strokeWidth={2} />
                                )}
                            </div>

                            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-600/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5">
                                <div className="space-y-2">
                                    <p className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{log.action}</p>
                                    <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                        <span>{log.meta}</span>
                                    </p>
                                </div>
                                <div className="text-right space-y-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</p>
                                    <div className={`flex items-center justify-end gap-2.5 px-3 py-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} border border-transparent`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === "success" ? "bg-emerald-500" : "bg-amber-500"} shadow-sm`} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.1em]">{log.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeUp>
                ))}
            </div>
        </div>
    );
}
