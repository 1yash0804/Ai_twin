"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
        ),
        title: "Commitment Detection",
        description: "TwinLabs identifies promises and requests in any thread — across Slack, WhatsApp, and Telegram."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
        ),
        title: "Platform-Agnostic Extraction",
        description: "Built for teams managing work in chat. TwinLabs focuses on extracting commitments, not replacing your apps."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
        ),
        title: "Operational Memory",
        description: "Converts chat noise into a clean, searchable database of client work and responsibilities automatically."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7A8.38 8.38 0 0 1 15 4.5" /><path d="M22 4s-1 1-4 1-5-2-8-2-4 1-4 1V15s1-1 4-1 5 2 8 2 4-1 4-1V4Z" /><line x1="6" x2="6" y1="22" y2="15" />
            </svg>
        ),
        title: "Follow-Up Intelligence",
        description: "See exactly who you owe a response to, and who is still holding up your next step across platforms."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
        title: "Workflow Specific",
        description: "TwinLabs understands professional commitments. No generic AI chatter — just tasks and deadlines."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h9z" />
            </svg>
        ),
        title: "Silent Operations",
        description: "Extraction happens in the background. No distracting notifications. Pure operational intelligence."
    },
];

export default function FeatureGrid() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-32 bg-white" id="capabilities">
            <div className="max-w-6xl mx-auto px-6">

                <div className="max-w-3xl mb-24 space-y-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em]"
                    >
                        Core Capabilities
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
                    >
                        Platform-agnostic. Workflow-specific.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-500 text-lg leading-relaxed max-w-2xl"
                    >
                        TwinLabs focuses on extracting commitments and operational tasks — not replacing your existing chat workflows.
                    </motion.p>
                </div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-6 group"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                                {f.icon}
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {f.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
