"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl text-slate-900 tracking-tight">TwinLabs</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="#features" className="hover:text-slate-900 transition-colors">Product</Link>
                    <Link href="#who" className="hover:text-slate-900 transition-colors">Users</Link>
                    <Link href="#security" className="hover:text-slate-900 transition-colors">Security</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                    >
                        Log In
                    </Link>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        Join Early Access
                    </motion.button>
                </div>
            </div>
        </nav>
    );
}
