"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";

const problems = [
    {
        num: "01",
        title: "Approvals buried in 200 messages.",
        detail: "You scroll back 3 hours to find one \"yes\" from a client.",
        icon: "📩",
    },
    {
        num: "02",
        title: "Deadlines lost in group chats.",
        detail: "Everyone assumed someone else was tracking it. Nobody was.",
        icon: "💬",
    },
    {
        num: "03",
        title: "Follow-ups forgotten.",
        detail: "The client's waiting. You forgot. Trust erodes one missed message at a time.",
        icon: "⏰",
    },
    {
        num: "04",
        title: "Mental overload from constant scanning.",
        detail: "Your brain becomes the system. It's not built for this.",
        icon: "🧠",
    },
];

const costs = [
    { stat: "1 in 4", label: "client disputes from a missed message" },
    { stat: "3 hrs", label: "per day lost scrolling chat history" },
    { stat: "68%", label: "of founders miss follow-ups weekly" },
    { stat: "0", label: "tools built for chat-first workflows — until now" },
];

export default function Problem() {
    return (
        <section className="bg-white border-b border-stone-200" id="problem">

            {/* ── Top half: warm bg ── */}
            <div className="bg-[#f4f2ee] border-b border-stone-200 py-16">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">

                    {/* Header — two column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
                        <FadeUp>
                            <div>
                                <p
                                    className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500 mb-4"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    The problem
                                </p>
                                <h2
                                    className="text-4xl lg:text-[3.25rem] text-stone-900 leading-[1.06] tracking-tight"
                                    style={{ fontFamily: "'DM Serif Display', serif" }}
                                >
                                    Your business lives<br />
                                    <em className="not-italic text-stone-400">inside chat.</em>
                                </h2>
                            </div>
                        </FadeUp>
                        <FadeUp delay={0.1}>
                            <p className="text-base text-stone-500 font-medium leading-relaxed lg:pb-2">
                                Telegram and WhatsApp are where real work happens — but they were
                                never built for it. Every commitment, deadline, and approval gets
                                swallowed by the feed.
                            </p>
                        </FadeUp>
                    </div>
                </div>
            </div>

            {/* ── Problem list ── */}
            <div className="py-12 border-b border-stone-100">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
                        {problems.map((p, i) => (
                            <FadeUp key={i} delay={i * 0.07}>
                                <div className="
                  group bg-white p-7 flex items-start gap-5
                  hover:bg-stone-50 transition-colors duration-200
                  cursor-default
                ">
                                    {/* Number */}
                                    <span
                                        className="text-[11px] font-bold text-stone-300 shrink-0 mt-1 w-6"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        {p.num}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-stone-900 mb-1.5 leading-snug">
                                            {p.title}
                                        </p>
                                        <p className="text-sm text-stone-400 font-medium leading-relaxed">
                                            {p.detail}
                                        </p>
                                    </div>
                                    {/* Emoji fades in on hover */}
                                    <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                                        {p.icon}
                                    </span>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Pull quote ── */}
            <div className="py-12 border-b border-stone-100">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <FadeUp delay={0.15}>
                        <div className="flex items-start gap-6">
                            <div className="w-1 self-stretch bg-stone-200 rounded-full shrink-0" />
                            <p
                                className="text-2xl lg:text-3xl text-stone-600 leading-snug tracking-tight italic"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                &ldquo;The information existed.<br />The system did not.&rdquo;
                            </p>
                        </div>
                    </FadeUp>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="py-12 border-b border-stone-100">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <FadeUp delay={0.1}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
                            {costs.map((c, i) => (
                                <div key={i} className="bg-white px-7 py-6 hover:bg-stone-50 transition-colors">
                                    <p
                                        className="text-3xl font-bold text-stone-900 mb-1.5 tracking-tight"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        {c.stat}
                                    </p>
                                    <p className="text-xs font-semibold text-stone-400 leading-relaxed">
                                        {c.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </div>

            {/* ── Bottom callout ── */}
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <FadeUp delay={0.1}>
                        <div className="flex items-center gap-4 p-5 rounded-2xl
              bg-rose-50 border border-rose-100">
                            <span className="text-rose-400 text-xl shrink-0">→</span>
                            <p className="text-sm font-semibold text-rose-800 leading-relaxed">
                                One missed follow-up can cost more than this tool costs in an entire year.
                            </p>
                        </div>
                    </FadeUp>
                </div>
            </div>

        </section>
    );
}