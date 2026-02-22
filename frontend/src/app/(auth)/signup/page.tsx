"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <FadeUp>
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/50">
                    <div className="text-center mb-10 space-y-4">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Join TwinLabs</h1>
                        <p className="text-slate-500 font-medium">We are currently in private early access. Request your spot below.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Yash Singh"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                            <input
                                type="email"
                                placeholder="yash@company.com"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Description</label>
                            <textarea
                                placeholder="How do you use WhatsApp for your business?"
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium resize-none"
                            />
                        </div>

                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                        >
                            Request Early Access
                        </motion.button>
                    </form>

                    <p className="text-center mt-10 text-sm font-medium text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Sign in</Link>
                    </p>
                </div>
            </FadeUp>
        </div>
    );
}
