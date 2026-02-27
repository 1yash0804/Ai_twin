"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, MessageSquare, CalendarClock, Brain } from "lucide-react";

const feed = [
    {
        type: "task" as const,
        icon: CalendarClock,
        iconStyle: "bg-amber-50 text-amber-600 border-amber-100",
        label: "task",
        labelStyle: "bg-amber-50 text-amber-700 border-amber-200",
        text: "Review investor deck by Friday 5pm",
        confidence: 91,
        time: "2m ago",
    },
    {
        type: "memory" as const,
        icon: Brain,
        iconStyle: "bg-violet-50 text-violet-600 border-violet-100",
        label: "memory",
        labelStyle: "bg-violet-50 text-violet-700 border-violet-200",
        text: "Client prefers async over calls",
        confidence: 88,
        time: "18m ago",
    },
    {
        type: "task" as const,
        icon: CheckCircle2,
        iconStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
        label: "task",
        labelStyle: "bg-amber-50 text-amber-700 border-amber-200",
        text: "Send onboarding checklist to Riya",
        confidence: 95,
        time: "1h ago",
    },
];

export function HeroMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg mx-auto"
        >
            {/* Glow */}
            <div className="absolute -inset-4 bg-indigo-100/30 rounded-[2.5rem] blur-2xl -z-10" />

            <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl shadow-stone-300/30 overflow-hidden">

                {/* Mockup browser bar */}
                <div className="h-10 bg-stone-50 border-b border-stone-200
          flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-stone-200" />
                    <div className="w-3 h-3 rounded-full bg-stone-200" />
                    <div className="w-3 h-3 rounded-full bg-stone-200" />
                    <span className="flex-1 text-center text-[11px] font-medium text-stone-400"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        app.twinlabs.ai
                    </span>
                </div>

                {/* Header */}
                <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-0.5"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            Live pipeline
                        </p>
                        <p className="text-sm font-bold text-stone-900">Extraction feed</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-emerald-50 border border-emerald-200">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">Active</span>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-stone-100 border-b border-stone-100">
                    {[
                        { label: "Extracted", value: "38" },
                        { label: "Memories", value: "142" },
                        { label: "Yield", value: "91%" },
                    ].map((s) => (
                        <div key={s.label} className="px-4 py-3 text-center">
                            <p className="text-base font-bold text-stone-900"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {s.value}
                            </p>
                            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mt-0.5">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Feed items */}
                <div className="p-4 space-y-2.5">
                    {feed.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.13 }}
                            className={`
                flex items-center gap-3 p-3.5 rounded-xl border
                bg-stone-50/60 border-stone-100
                ${i === 0 ? "border-l-[3px] border-l-indigo-400 bg-indigo-50/30" : ""}
              `}
                        >
                            {/* Icon */}
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${item.iconStyle}`}>
                                <item.icon size={14} strokeWidth={2} />
                            </div>

                            {/* Text */}
                            <p className="text-xs font-semibold text-stone-800 flex-1 leading-snug">
                                {item.text}
                            </p>

                            {/* Right meta */}
                            <div className="text-right shrink-0 space-y-1">
                                <span className={`inline-block text-[8px] font-bold uppercase tracking-widest
                  px-1.5 py-0.5 rounded border ${item.labelStyle}`}>
                                    {item.label}
                                </span>
                                <p className="text-[10px] text-stone-400 font-medium"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {item.time}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer strip */}
                <div className="mx-4 mb-4 rounded-xl bg-indigo-600 px-4 py-3
          flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={13} className="text-indigo-300" />
                        <p className="text-xs font-semibold text-indigo-100">
                            3 items extracted from last message
                        </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-300"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        312ms
                    </span>
                </div>

            </div>
        </motion.div>
    );
}