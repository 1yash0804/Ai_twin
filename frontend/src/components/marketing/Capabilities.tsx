"use client";
import { FadeUp, Stagger } from "@/components/animation/MotionWrappers";
import { CheckCircle2, Search, Brain, Clock } from "lucide-react";

const capabilities = [
    {
        title: "Commitment Extraction",
        desc: "Automatically identifies promises, deadlines, and tasks hidden within messages.",
        icon: CheckCircle2
    },
    {
        title: "Contextual Memory",
        desc: "Remembers past interactions and client preferences to provide instant context.",
        icon: Brain
    },
    {
        title: "Operational Search",
        desc: "Find any commitment across all your threads instantly. No more scrolling back.",
        icon: Search
    },
    {
        title: "Deadline Tracking",
        desc: "Visualizes upcoming obligations so you can prioritize what matters most.",
        icon: Clock
    },
];

export default function Capabilities() {
    return (
        <section className="py-32 bg-slate-50 border-y border-slate-100" id="features">
            <div className="max-w-6xl mx-auto px-6">
                <div className="max-w-3xl mb-24">
                    <FadeUp>
                        <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
                            Operational Intelligence<br />
                            <span className="text-slate-400">for WhatsApp-driven work.</span>
                        </h2>
                    </FadeUp>
                </div>

                <Stagger interval={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {capabilities.map((c, i) => (
                            <FadeUp key={i}>
                                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 mb-8">
                                        <c.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">{c.desc}</p>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </Stagger>
            </div>
        </section>
    );
}
