"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, MessageSquare, CalendarClock, ArrowRight } from "lucide-react";

const steps = [
    {
        title: "Incoming Chat",
        detail: "Client asks for proposal revision by 5 PM.",
        icon: MessageSquare,
        tone: "bg-slate-100 text-slate-600",
    },
    {
        title: "AI Extraction",
        detail: "TwinLabs detects task, owner, and deadline.",
        icon: Sparkles,
        tone: "bg-indigo-50 text-indigo-600",
    },
    {
        title: "Actionable Output",
        detail: "Commitment is added with follow-up reminder.",
        icon: CalendarClock,
        tone: "bg-emerald-50 text-emerald-600",
    },
];

export function HeroMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-xl mx-auto"
        >
            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600">Product Preview</p>
                        <h3 className="text-lg font-semibold text-slate-900 mt-1">How TwinLabs helps in real time</h3>
                    </div>
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live pipeline
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.45 + index * 0.12 }}
                            className="rounded-2xl border border-slate-200 p-4 bg-white"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.tone}`}>
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.detail}</p>
                                </div>
                                {index < steps.length - 1 ? (
                                    <ArrowRight className="w-4 h-4 text-slate-300 mt-3" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-3" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="px-6 pb-6">
                    <div className="rounded-2xl bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
                        <p className="text-xs font-medium">Result: team never misses key tasks from WhatsApp threads.</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100">Auto-synced</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
