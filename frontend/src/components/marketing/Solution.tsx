"use client";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";

export default function Solution() {
    return (
        <section className="py-32 overflow-hidden bg-white" id="how">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center space-y-6 mb-24">
                    <FadeUp>
                        <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight">
                            Conversation Is Unstructured.<br />
                            <span className="text-slate-400">Your Work Is Not.</span>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.1}>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                            TwinLabs converts chat noise into operational clarity — automatically.
                        </p>
                    </FadeUp>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 relative">
                    {/* Subtle Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-video bg-indigo-50/50 blur-[120px] -z-10" />

                    {/* Left: Input */}
                    <FadeUp delay={0.2}>
                        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 relative">
                            <div className="h-1 w-full absolute top-0 left-0 bg-slate-100 rounded-t-[2.5rem] overflow-hidden">
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
                                />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Unstructured Chat</p>
                            <div className="space-y-6">
                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">"Hey, remember to send the contract to Aditya by Thursday EOD."</p>
                                </div>
                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl opacity-50">
                                    <p className="text-sm text-slate-500 font-medium">"Got it, will do!"</p>
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Center: Logic Icon */}
                    <div className="hidden md:flex flex-col items-center gap-6">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/30"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing</p>
                    </div>

                    {/* Right: Output */}
                    <FadeUp delay={0.4}>
                        <div className="w-full max-w-sm bg-indigo-50/30 border border-indigo-100 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.5)]" />
                            </div>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-8">Structured commitment</p>
                            <div className="space-y-6">
                                <div className="p-8 bg-white border border-indigo-200/50 rounded-2xl shadow-lg shadow-indigo-600/5">
                                    <p className="text-base font-bold text-slate-900 mb-4 tracking-tight">Send contract to Aditya</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full uppercase tracking-wider">Thursday EOD</span>
                                        <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-wider">extracted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}
