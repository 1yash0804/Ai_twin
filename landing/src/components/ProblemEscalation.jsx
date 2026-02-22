"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const bullets = [
    { text: "Client approvals buried in 500+ daily messages.", icon: "📩" },
    { text: "Deadlines fragments scattered across threads.", icon: "⏰" },
    { text: "Follow-ups forgotten. Clients left waiting.", icon: "😬" },
    { text: "Mental overload from constant context-switching.", icon: "🧠" },
];

export default function ProblemEscalation() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-32 bg-gray-50">
            <div className="max-w-3xl mx-auto px-6">

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] mb-6"
                >
                    The Problem
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-16 leading-tight"
                >
                    Your Business Runs Inside Chat Threads.
                </motion.h2>

                <div ref={ref} className="space-y-4">
                    {bullets.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
                        >
                            <span className="text-xl shrink-0 opacity-50 grayscale">{item.icon}</span>
                            <p className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">{item.text}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-16 text-gray-500 text-lg sm:text-xl font-medium italic border-l-4 border-gray-200 pl-6 leading-relaxed"
                >
                    &ldquo;The information exists. The system doesn’t.&rdquo;
                </motion.p>
            </div>
        </section>
    );
}
