"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Differentiation() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-32 bg-white">
            <div className="max-w-4xl mx-auto px-6">

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-center mb-24 leading-tight"
                >
                    TwinLabs vs. The Status Quo
                </motion.h2>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Manual */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-gray-50 border border-gray-100 rounded-3xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">Manual</div>
                            <h3 className="font-bold text-gray-900">General Task Apps</h3>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Manual data entry from chat threads",
                                "Deadlines typed by hand in separate apps",
                                "Context lost in fragmented message history",
                                "Follow-ups depend on your mental memory",
                                "Constant switching between chat and tools",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm text-gray-400 font-medium">
                                    <span className="mt-1 text-gray-300">/</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* TwinLabs */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-gray-900 border-2 border-gray-900 rounded-3xl p-8 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-white">Live</div>
                            <h3 className="font-bold text-white">TwinLabs</h3>
                            <span className="ml-auto text-[9px] font-bold text-gray-400 border border-gray-700 px-2 py-1 rounded uppercase tracking-widest">System</span>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "AI extracts tasks automatically from chat",
                                "Deadlines inferred from work conversations",
                                "Context linked to every operational entry",
                                "Follow-ups surfaced proactively by the AI",
                                "Silent background ops across platforms",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm text-gray-200 font-medium tracking-tight">
                                    <span className="mt-1 text-white">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
