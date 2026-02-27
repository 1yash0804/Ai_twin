"use client";
import { FadeUp, Stagger } from "@/components/animation/MotionWrappers";
import { CheckCircle2, Search, Brain, Clock } from "lucide-react";

const capabilities = [
    {
        title: "Commitment Extraction",
        desc: "Automatically identifies promises, deadlines, and tasks hidden within messages.",
        icon: CheckCircle2,
        pill: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
        title: "Contextual Memory",
        desc: "Remembers past interactions and client preferences to provide instant context.",
        icon: Brain,
        pill: "bg-violet-50 text-violet-600 border-violet-100",
    },
    {
        title: "Operational Search",
        desc: "Find any commitment across all your threads instantly. No more scrolling back.",
        icon: Search,
        pill: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
        title: "Deadline Tracking",
        desc: "Visualizes upcoming obligations so you can prioritize what matters most.",
        icon: Clock,
        pill: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
];

export default function Capabilities() {
    return (
        <section className="py-28 bg-[#f4f2ee] border-y border-stone-200" id="features">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                <div className="max-w-2xl mb-20">
                    <FadeUp>
                        <p className="text-[25px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            Capabilities
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.07}>
                        <h2 className="text-4xl lg:text-5xl text-stone-900 leading-[1.08] tracking-tight mb-5"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Operational intelligence<br />
                            <em className="not-italic text-stone-400">for chat-driven work.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.12}>
                        <p className="text-base text-stone-500 font-medium leading-relaxed">
                            Everything you need to turn chaotic conversations into structured, actionable work.
                        </p>
                    </FadeUp>
                </div>

                <Stagger interval={0.08}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {capabilities.map((c, i) => (
                            <FadeUp key={i}>
                                <div className="group bg-white border border-stone-200 rounded-2xl p-7
                  hover:shadow-xl hover:shadow-stone-200/60 hover:border-stone-300
                  hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5
                    transition-transform duration-300 group-hover:scale-110 ${c.pill}`}>
                                        <c.icon size={18} strokeWidth={1.75} />
                                    </div>
                                    <h3 className="text-sm font-bold text-stone-900 mb-2.5 tracking-tight">
                                        {c.title}
                                    </h3>
                                    <p className="text-sm text-stone-500 leading-relaxed font-medium flex-1">
                                        {c.desc}
                                    </p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </Stagger>

                <FadeUp delay={0.3}>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x
            divide-stone-200 border border-stone-200 rounded-2xl bg-white overflow-hidden">
                        {[
                            { label: "Avg. extraction time", value: "< 400ms" },
                            { label: "Confidence scoring", value: "Per task" },
                            { label: "Channels supported", value: "Telegram + more" },
                        ].map((s) => (
                            <div key={s.label} className="px-8 py-5 flex items-center justify-between gap-4">
                                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                    {s.label}
                                </span>
                                <span className="text-sm font-bold text-stone-800"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {s.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </FadeUp>

            </div>
        </section>
    );
}