"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";

const problems = [
    "Client approvals buried in 200 messages.",
    "Deadlines lost in fragmented group chats.",
    "Follow-ups forgotten. Clients left waiting.",
    "Mental overload from constant scanning.",
];

export default function Problem() {
    return (
        <section className="py-32 bg-slate-50 border-y border-slate-100">
            <div className="max-w-4xl mx-auto px-6">
                <FadeUp>
                    <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-20 text-center">
                        Your Business Lives Inside WhatsApp.
                    </h2>
                </FadeUp>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {problems.map((p, i) => (
                        <FadeUp key={i} delay={i * 0.1}>
                            <div className="flex items-start gap-5 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-1 grayscale">
                                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                                </div>
                                <p className="text-lg text-slate-700 font-semibold tracking-tight leading-relaxed">{p}</p>
                            </div>
                        </FadeUp>
                    ))}
                </div>

                <FadeUp delay={0.5}>
                    <div className="mt-24 border-l-4 border-indigo-600/30 pl-10 space-y-2">
                        <p className="text-4xl font-semibold text-slate-900 tracking-tighter leading-tight italic">
                            &ldquo;The information existed. The system did not.&rdquo;
                        </p>
                    </div>
                </FadeUp>

                <div className="mt-40 space-y-12">
                    <FadeUp>
                        <h3 className="text-2xl font-semibold text-slate-900 text-center">The Cost of Missing One Message</h3>
                    </FadeUp>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {["Lost client trust", "Delayed payments", "Operational friction", "Mental overload"].map((point, i) => (
                            <FadeUp key={i} delay={0.6 + i * 0.08}>
                                <div className="bg-white border border-slate-200 p-6 rounded-xl text-center shadow-sm">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">{point}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                    <FadeUp delay={0.8}>
                        <p className="text-center text-indigo-600 font-bold text-xl leading-relaxed mt-4">
                            One missed follow-up can cost more than this tool costs in a year.
                        </p>
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}
