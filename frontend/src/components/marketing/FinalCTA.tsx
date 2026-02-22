"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { motion } from "framer-motion";

export default function FinalCTA() {
    return (
        <section className="py-32 bg-indigo-600 relative overflow-hidden" id="join">
            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <FadeUp>
                    <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-8">
                        Take Control of Your<br />Conversational Operations.
                    </h2>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join the operational intelligence layer for WhatsApp. Secure, private, and built for businesses that move fast.
                    </p>
                </FadeUp>

                <FadeUp delay={0.2}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto bg-white text-indigo-600 font-bold px-10 py-5 rounded-2xl text-lg shadow-2xl shadow-black/20"
                        >
                            Join Early Access
                        </motion.button>
                        <p className="text-indigo-200 text-sm font-medium">Limited spots available for Q1 2026.</p>
                    </div>
                </FadeUp>

                <div className="mt-24 pt-12 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/60">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Security</p>
                        <p className="text-sm font-medium">Enterprise Grade</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Integration</p>
                        <p className="text-sm font-medium">WhatsApp Business API</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Data Policy</p>
                        <p className="text-sm font-medium">Your data, your control</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
