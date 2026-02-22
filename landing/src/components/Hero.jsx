"use client";
import { motion } from "framer-motion";
import DashboardMockup from "./DashboardMockup";

export default function Hero() {
    return (
        <section className="min-h-screen pt-20 flex flex-col justify-center bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="inline-flex items-center gap-2 bg-gray-50 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                                Early Access — Limited Spots
                            </span>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 leading-[1.1] tracking-tight"
                            >
                                Your Work Lives in Chat.<br />
                                <span className="text-gray-400">That’s the Problem.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="text-lg text-gray-500 leading-relaxed max-w-lg"
                            >
                                TwinLabs turns work conversations across chat platforms into structured tasks, tracked commitments, and operational memory — automatically.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                className="text-sm font-medium text-gray-900 border-l-2 border-gray-900 pl-4"
                            >
                                Built for founders, agencies, and client-facing teams managing operations inside chat.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <motion.a
                                href="#early-access"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex justify-center items-center bg-gray-900 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-black transition-all shadow-lg text-center"
                            >
                                Join Early Access
                            </motion.a>
                            <motion.a
                                href="#how-it-works"
                                whileHover={{ y: -1, backgroundColor: "rgba(0,0,0,0.02)" }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex justify-center items-center border border-gray-200 text-gray-900 font-semibold px-8 py-4 rounded-xl text-base transition-all text-center"
                            >
                                See How It Works
                            </motion.a>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-sm text-gray-400"
                        >
                            No credit card required · Setup in minutes · Works across chat platforms
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden lg:block relative"
                    >
                        <div className="absolute -inset-4 bg-gray-100/50 rounded-[2rem] blur-2xl -z-10" />
                        <DashboardMockup />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
