"use client";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-900 rounded flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 2L3 4.5V9.5L7 12L11 9.5V4.5L7 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-900 tracking-tight text-lg">TwinLabs</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-medium tracking-tight">
                    <a href="#how-it-works" className="hover:text-gray-900 transition-colors">Capability</a>
                    <a href="#who" className="hover:text-gray-900 transition-colors">Users</a>
                    <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
                </div>

                <motion.a
                    href="#early-access"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="hidden md:inline-flex bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors shadow-sm"
                >
                    Join Early Access
                </motion.a>
            </div>
        </nav>
    );
}
