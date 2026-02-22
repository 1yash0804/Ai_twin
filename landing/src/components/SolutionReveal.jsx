"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SolutionReveal() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-32 bg-gray-50" id="how-it-works">
            <div className="max-w-5xl mx-auto px-6">

                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
                    >
                        Conversation Is Unstructured.<br />
                        <span className="text-gray-400">Your Work Is Not.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-500 text-lg sm:text-xl leading-relaxed"
                    >
                        TwinLabs converts chat noise into operational clarity — across platforms.
                    </motion.p>
                </div>

                <div ref={ref} className="flex flex-col md:flex-row items-center gap-12 justify-center">

                    {/* Left: Neutral chat message */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-xs bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">A</div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Alex</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Work Thread</p>
                            </div>
                        </div>
                        <p className="text-base font-medium text-gray-900 leading-snug">
                            &ldquo;Send proposal to the client by Friday.&rdquo;
                        </p>
                        <div className="mt-2 inline-flex items-center self-start bg-gray-900 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                            Commitment detected
                        </div>
                    </motion.div>

                    {/* Transformation indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex items-center justify-center relative w-12 h-12"
                    >
                        <div className="absolute inset-0 bg-gray-100 rounded-full animate-ping opacity-20" />
                        <span className="text-gray-300 text-xl font-light">→</span>
                    </motion.div>

                    {/* Right: Task card */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-xs bg-white border-2 border-gray-900 rounded-[2rem] p-8 shadow-xl relative"
                    >
                        <div className="absolute top-4 right-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">TwinLabs Intelligence</div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold text-white bg-gray-900 px-2.5 py-1 rounded-full uppercase tracking-widest">Task</span>
                            <div className="w-5 h-5 rounded-full border-2 border-gray-100" />
                        </div>

                        <p className="text-lg font-bold text-gray-900 leading-tight mb-4">Send proposal to client</p>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-gray-100 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full px-3">Friday</span>
                            <span className="bg-gray-100 text-gray-900 text-[10px] font-bold px-2 py-1 rounded-full px-3">Alex</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            From: Work Thread · Auto-detected
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
