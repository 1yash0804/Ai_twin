"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="py-32 bg-stone-900 relative overflow-hidden" id="join">

            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }} />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

                <FadeUp>
                    <p className="text-[25px] font-bold uppercase tracking-[0.22em] text-indigo-400 mb-6"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Get started
                    </p>
                </FadeUp>

                <FadeUp delay={0.07}>
                    <h2 className="text-4xl lg:text-6xl text-white leading-[1.07] tracking-tight mb-6"
                        style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Stop letting commitments<br />
                        <em className="not-italic text-stone-400">slip through the cracks.</em>
                    </h2>
                </FadeUp>

                <FadeUp delay={0.14}>
                    <p className="text-lg text-stone-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                        Join 200+ founders and agencies using TwinLabs to turn
                        conversations into structured, actionable work.
                    </p>
                </FadeUp>

                <FadeUp delay={0.2}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                            <Link href="/signup"
                                className="inline-block bg-white text-stone-900 font-bold
                  px-10 py-4 rounded-xl text-sm shadow-2xl shadow-black/30
                  hover:bg-stone-100 transition-colors">
                                Start for free →
                            </Link>
                        </motion.div>
                        <Link href="/dashboard"
                            className="inline-block border border-stone-700 text-stone-300 font-semibold
                px-10 py-4 rounded-xl text-sm
                hover:border-stone-500 hover:text-white transition-colors">
                            View dashboard
                        </Link>
                    </div>
                    <p className="text-xs text-stone-600 font-medium"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        No credit card required · Free during beta
                    </p>
                </FadeUp>

                <FadeUp delay={0.28}>
                    <div className="mt-20 pt-10 border-t border-stone-800
            grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { label: "Security", value: "Enterprise grade" },
                            { label: "Integration", value: "Telegram + WhatsApp API" },
                            { label: "Data policy", value: "Your data, your control" },
                        ].map((s) => (
                            <div key={s.label} className="space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {s.label}
                                </p>
                                <p className="text-sm font-semibold text-stone-300">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </FadeUp>

            </div>
        </section>
    );
}