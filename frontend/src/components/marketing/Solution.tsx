"use client";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { ArrowRight, Zap } from "lucide-react";

export default function Solution() {
    return (
        <section className="py-28 bg-[#f4f2ee] border-b border-stone-200 overflow-hidden" id="how">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="max-w-2xl mb-20">
                    <FadeUp>
                        <p className="text-[25px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            How it works
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.07}>
                        <h2 className="text-4xl lg:text-5xl text-stone-900 leading-[1.08] tracking-tight mb-5"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Conversation is messy.<br />
                            <em className="not-italic text-stone-400">Your work doesn't have to be.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.12}>
                        <p className="text-base text-stone-500 font-medium leading-relaxed">
                            TwinLabs sits between your chat and your workflow — turning noise into
                            structured tasks and memory automatically.
                        </p>
                    </FadeUp>
                </div>

                {/* Before → After */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_64px_1fr] gap-5 items-center mb-20">

                    {/* Before — chat bubble */}
                    <FadeUp delay={0.1}>
                        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/60 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Telegram · Group chat
                                </span>
                                <span className="text-[10px] font-medium text-stone-300"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    raw
                                </span>
                            </div>

                            {/* Scanning shimmer bar */}
                            <div className="h-0.5 w-full overflow-hidden bg-stone-100">
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
                                />
                            </div>

                            <div className="p-5 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-blue-600">A</div>
                                    <div className="bg-stone-50 border border-stone-100 rounded-xl rounded-tl-none px-4 py-3 max-w-[85%]">
                                        <p className="text-sm text-stone-700 font-medium leading-relaxed">
                                            "Hey, remember to send the contract to Aditya by Thursday EOD. Also check the invoice status with Priya."
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 justify-end">
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl rounded-tr-none px-4 py-3 max-w-[75%]">
                                        <p className="text-sm text-indigo-700 font-medium leading-relaxed">"Got it, will do!"</p>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-indigo-600">Y</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-blue-600">A</div>
                                    <div className="bg-stone-50 border border-stone-100 rounded-xl rounded-tl-none px-4 py-3 max-w-[85%]">
                                        <p className="text-sm text-stone-700 font-medium leading-relaxed">
                                            "Also the client call is Friday 3pm. Don't forget."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 pb-4">
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-stone-300">
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>3 tasks buried in 3 messages</span>
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Arrow */}
                    <div className="hidden md:flex flex-col items-center gap-3">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center
                shadow-lg shadow-indigo-600/25"
                        >
                            <ArrowRight size={18} className="text-white" />
                        </motion.div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            AI
                        </span>
                    </div>

                    {/* After — structured output */}
                    <FadeUp delay={0.25}>
                        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/60 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    TwinLabs · Extracted
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600">live</span>
                                </div>
                            </div>

                            <div className="p-5 space-y-2.5">
                                {[
                                    {
                                        text: "Send contract to Aditya",
                                        tag: "task",
                                        meta: "Thursday EOD",
                                        tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
                                        metaStyle: "text-stone-400",
                                        conf: 94,
                                        accent: "border-l-amber-400",
                                    },
                                    {
                                        text: "Check invoice status with Priya",
                                        tag: "task",
                                        meta: "no deadline",
                                        tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
                                        metaStyle: "text-stone-300",
                                        conf: 88,
                                        accent: "border-l-amber-400",
                                    },
                                    {
                                        text: "Client call on Friday",
                                        tag: "task",
                                        meta: "Friday 3pm",
                                        tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
                                        metaStyle: "text-stone-400",
                                        conf: 97,
                                        accent: "border-l-amber-400",
                                    },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl
                      border border-stone-100 bg-stone-50/60
                      border-l-[3px] ${item.accent}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-stone-800 leading-snug mb-1">
                                                {item.text}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[8px] font-bold uppercase tracking-widest
                          px-1.5 py-0.5 rounded border ${item.tagStyle}`}>
                                                    {item.tag}
                                                </span>
                                                <span className={`text-[10px] font-medium ${item.metaStyle}`}
                                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                    {item.meta}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-stone-400 shrink-0"
                                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            {item.conf}%
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mx-5 mb-5 rounded-xl bg-indigo-600 px-4 py-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap size={11} className="text-indigo-300" />
                                    <span className="text-xs font-semibold text-indigo-100">3 tasks extracted automatically</span>
                                </div>
                                <span className="text-[9px] font-bold text-indigo-300"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    287ms
                                </span>
                            </div>
                        </div>
                    </FadeUp>
                </div>

                {/* Step flow */}
                <FadeUp delay={0.35}>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        {[
                            { num: "01", title: "Message arrives", detail: "Via Telegram bot webhook" },
                            { num: "02", title: "AI scans content", detail: "LLM identifies commitments" },
                            { num: "03", title: "Tasks created", detail: "With confidence scores" },
                            { num: "04", title: "Memory updated", detail: "Context stored for your twin" },
                        ].map((s, i) => (
                            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5
                flex flex-col gap-3 hover:border-stone-300 hover:shadow-md
                hover:shadow-stone-200/60 transition-all duration-300">
                                <span className="text-[11px] font-bold text-indigo-600"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {s.num}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-stone-900 mb-0.5">{s.title}</p>
                                    <p className="text-xs font-medium text-stone-400">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeUp>

            </div>
        </section>
    );
}