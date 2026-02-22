"use client";
import { FadeUp, Stagger } from "@/components/animation/MotionWrappers";
import { User, Phone, MapPin, Briefcase } from "lucide-react";

const clients = [
    { name: "Acme Corp", contact: "Alex D.", context: "Prefers concise updates. Focus on proposal margins.", threads: 12 },
    { name: "Sarah K.", contact: "Sarah K.", context: "Agency owner. High priority on follow-ups.", threads: 42 },
    { name: "Design Studio", contact: "Mark J.", context: "Weekend worker. Responds best on Saturdays.", threads: 8 },
    { name: "Legal Pro", contact: "Linda", context: "Strict deadlines. No tolerance for late filings.", threads: 15 },
];

export default function MemoryPage() {
    return (
        <div className="p-10 space-y-16 bg-slate-50/50 min-h-full">
            <FadeUp>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Client Memory</h1>
                    <p className="text-base text-slate-500 font-medium">Automated context repository for all your work contacts.</p>
                </div>
            </FadeUp>

            <Stagger interval={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {clients.map((client, i) => (
                        <FadeUp key={i}>
                            <div className="bg-white border border-slate-200 p-10 rounded-[3rem] group hover:border-indigo-600/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5 relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 p-8">
                                    <Briefcase size={24} className="text-slate-100 group-hover:text-indigo-100 transition-colors" strokeWidth={1.5} />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight group-hover:text-indigo-600 transition-colors">{client.name}</h3>

                                <div className="space-y-8 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automated Context</p>
                                        <p className="text-base text-slate-600 leading-relaxed font-semibold italic">
                                            &ldquo;{client.context}&rdquo;
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                <User size={16} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{client.contact}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">{client.threads} Threads</span>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </Stagger>
        </div>
    );
}
