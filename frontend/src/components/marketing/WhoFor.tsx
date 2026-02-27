"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { Check, X } from "lucide-react";

const segments = [
    {
        title: "Agencies &\nConsultants",
        emoji: "🏢",
        desc: "Running multiple client accounts through Telegram. Every thread a different project.",
        traits: ["High message volume", "Multiple client threads", "Client accountability needed"],
        accent: "border-indigo-200 hover:border-indigo-300",
        tag: "bg-indigo-50 text-indigo-600 border-indigo-200",
        tagLabel: "Perfect fit",
    },
    {
        title: "Operational\nLeaders",
        emoji: "📋",
        desc: "Managing a team over chat. Information gets buried. Accountability slips.",
        traits: ["Team oversight at scale", "Process bottlenecks", "Decision tracking needed"],
        accent: "border-violet-200 hover:border-violet-300",
        tag: "bg-violet-50 text-violet-600 border-violet-200",
        tagLabel: "Perfect fit",
    },
    {
        title: "Solopreneurs",
        emoji: "⚡",
        desc: "One person running everything. Chat is the whole business. Brain is the CRM.",
        traits: ["Solo bandwidth limits", "Every message matters", "No room for error"],
        accent: "border-emerald-200 hover:border-emerald-300",
        tag: "bg-emerald-50 text-emerald-600 border-emerald-200",
        tagLabel: "Perfect fit",
    },
];

const notFor = [
    "Casual personal messaging",
    "Teams with dedicated project managers",
    "Businesses not using chat for operations",
];

export default function WhoFor() {
    return (
        <section className="py-28 bg-white border-b border-stone-200" id="who">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="max-w-2xl mb-20">
                    <FadeUp>
                        <p className="text-[25px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            Who it's for
                        </p>
                    </FadeUp>
                    <FadeUp delay={0.07}>
                        <h2 className="text-4xl lg:text-5xl text-stone-900 leading-[1.08] tracking-tight mb-5"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Built for people who<br />
                            <em className="not-italic text-stone-400">run their world through chat.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.12}>
                        <p className="text-base text-stone-500 font-medium leading-relaxed">
                            If your business happens inside Telegram threads, TwinLabs was made for you.
                        </p>
                    </FadeUp>
                </div>

                {/* Segment cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {segments.map((s, i) => (
                        <FadeUp key={i} delay={i * 0.09}>
                            <div className={`
                group bg-white border rounded-2xl p-7
                hover:shadow-xl hover:shadow-stone-200/60 hover:-translate-y-1
                transition-all duration-300 h-full flex flex-col gap-6
                ${s.accent}
              `}>
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-3">
                                    <span className="text-3xl">{s.emoji}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest
                    px-2 py-1 rounded-md border ${s.tag}`}>
                                        {s.tagLabel}
                                    </span>
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 leading-tight tracking-tight whitespace-pre-line mb-2">
                                        {s.title}
                                    </h3>
                                    <p className="text-sm text-stone-400 font-medium leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>

                                {/* Traits */}
                                <ul className="space-y-2.5 mt-auto">
                                    {s.traits.map((t, idx) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-stone-600">
                                            <Check size={13} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeUp>
                    ))}
                </div>

                {/* Not for section */}
                <FadeUp delay={0.3}>
                    <div className="flex flex-col sm:flex-row items-start gap-6
            border border-stone-200 bg-stone-50 rounded-2xl p-6">
                        <div className="shrink-0">
                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Not for
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {notFor.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2
                  bg-white border border-stone-200 rounded-lg">
                                    <X size={11} className="text-stone-300 shrink-0" strokeWidth={2.5} />
                                    <span className="text-xs font-semibold text-stone-400">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeUp>

            </div>
        </section>
    );
}