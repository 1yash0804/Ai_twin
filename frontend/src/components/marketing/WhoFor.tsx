"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";

const segments = [
    {
        title: "Agencies & Consultants",
        items: ["High message volume", "Manual task logging", "Multiple client threads"],
    },
    {
        title: "Operational Leaders",
        items: ["Team oversight", "Process bottlenecks", "Information silos"],
    },
    {
        title: "Solopreneurs",
        items: ["One-man show", "Mental bandwidth limits", "Scaling friction"],
    },
];

const antiSegments = [
    {
        title: "Personal Chat Users",
        items: ["Casual messaging", "No business flow", "Privacy overhead"],
    },
];

export default function WhoFor() {
    return (
        <section className="py-32 bg-white" id="who">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-24 space-y-4">
                    <FadeUp>
                        <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">Who Is TwinLabs For?</h2>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        <p className="text-slate-500 font-medium text-lg">We built this for people who run their world through chat threads.</p>
                    </FadeUp>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {segments.map((s, i) => (
                        <FadeUp key={i} delay={i * 0.1}>
                            <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] h-full flex flex-col justify-between">
                                <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">{s.title}</h3>
                                <ul className="space-y-4">
                                    {s.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-500 font-medium">
                                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full shrink-0" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeUp>
                    ))}
                    {antiSegments.map((s, i) => (
                        <FadeUp key={i} delay={0.4}>
                            <div className="p-10 bg-white border border-dashed border-slate-200 rounded-[2.5rem] h-full flex flex-col justify-between grayscale opacity-60">
                                <h3 className="text-xl font-bold text-slate-400 mb-8 tracking-tight">{s.title}</h3>
                                <ul className="space-y-4">
                                    {s.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-400 font-medium">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    );
}
