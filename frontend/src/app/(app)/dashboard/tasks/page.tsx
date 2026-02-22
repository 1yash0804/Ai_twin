"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { MoreVertical, Filter, Download, Plus } from "lucide-react";

const commitments = [
    { id: 1, task: "Send proposal update", client: "Acme Corp", due: "Today", priority: "High", confidence: 92 },
    { id: 2, task: "Approve contract draft", client: "Sarah K.", due: "Tomorrow", priority: "Medium", confidence: 88 },
    { id: 3, task: "Schedule Q1 review", client: "Mark J.", due: "Friday", priority: "Low", confidence: 94 },
    { id: 4, task: "Review marketing deck", client: "Design Studio", due: "Monday", priority: "High", confidence: 79 },
    { id: 5, task: "Follow up on invoice #402", client: "Legal Team", due: "Tomorrow", priority: "Medium", confidence: 85 },
];

const priorityStyles = {
    High: "bg-rose-50 text-rose-600 border-rose-100",
    Medium: "bg-amber-50 text-amber-600 border-amber-100",
    Low: "bg-slate-50 text-slate-500 border-slate-100",
};

export default function CommitmentsPage() {
    return (
        <div className="p-10 space-y-10 bg-slate-50/50 min-h-full">
            <div className="flex items-center justify-between">
                <FadeUp>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Commitments</h1>
                        <p className="text-base text-slate-500 font-medium">Manage tasks and obligations extracted from chat.</p>
                    </div>
                </FadeUp>
                <div className="flex gap-4">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                        <Download size={20} />
                    </button>
                    <button className="flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                        <Plus size={20} />
                        Add Entry
                    </button>
                </div>
            </div>

            <FadeUp delay={0.1}>
                <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm shadow-slate-200/50">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2">Items <span className="text-slate-900">24</span></span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="flex items-center gap-2">Selected <span className="text-slate-900">0</span></span>
                        </div>
                        <button className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all">
                            <Filter size={14} className="text-slate-400" />
                            Filter
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/10">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Due Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence</th>
                                    <th className="px-8 py-5 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {commitments.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition-all group cursor-pointer">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.task}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">TR-82{c.id}</span>
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-600">{c.client}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">{c.due}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${priorityStyles[c.priority as keyof typeof priorityStyles]}`}>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                                        style={{ width: `${c.confidence}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400">{c.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-300 hover:text-slate-900 transition-all focus:ring-2 focus:ring-indigo-100">
                                                <MoreVertical size={18} strokeWidth={2.5} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </FadeUp>
        </div>
    );
}
