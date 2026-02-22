"use client";
import { motion } from "framer-motion";

export function HeroMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-lg mx-auto"
        >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] flex">
                {/* Sidebar */}
                <div className="w-16 border-r border-slate-100 p-3 flex flex-col gap-4 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/10">
                        <div className="w-4 h-4 rounded-sm bg-white" />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-lg bg-slate-200/50" />
                    ))}
                </div>
                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <div className="w-12 h-2 bg-slate-200 rounded mb-2" />
                            <div className="w-8 h-6 bg-slate-100 rounded" />
                        </div>
                        <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <div className="w-12 h-2 bg-slate-200 rounded mb-2" />
                            <div className="w-8 h-6 bg-slate-100 rounded" />
                        </div>
                    </div>
                    <div className="flex-1 bg-white border border-dashed border-slate-200 rounded-xl p-4 space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full bg-slate-100" />
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-2 w-full bg-slate-100 rounded" />
                                    <div className="h-2 w-2/3 bg-slate-50 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
