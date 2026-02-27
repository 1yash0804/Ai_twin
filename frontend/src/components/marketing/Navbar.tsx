"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
                ? "bg-[#f4f2ee]/95 backdrop-blur-md shadow-sm shadow-stone-200/60 border-b border-stone-200"
                : "bg-transparent border-b border-transparent"
            }
    `}>
            <div className="max-w-6xl mx-auto px-6 lg:px-8 h-[62px] flex items-center justify-between gap-8">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    {/* Pure wordmark — no icon box */}
                    <div className="flex items-baseline gap-0.5">
                        <span
                            className="text-[22px] leading-none text-stone-900 tracking-tight"
                            style={{ fontFamily: "'DM Serif Display', serif" }}
                        >
                            Twin
                        </span>
                        <span
                            className="text-[22px] leading-none text-indigo-600 tracking-tight"
                            style={{ fontFamily: "'DM Serif Display', serif" }}
                        >
                            Labs
                        </span>
                    </div>

                </Link>

                {/* ── Nav links ── */}
                <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {[
                        { label: "Product", href: "#features" },
                        { label: "Who it's for", href: "#who" },
                        { label: "How it works", href: "#how" },
                    ].map((l) => (
                        <Link
                            key={l.label}
                            href={l.href}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-stone-500
                hover:text-stone-900 hover:bg-stone-900/5
                transition-all duration-150"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link
                        href="/login"
                        className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium
              text-stone-500 hover:text-stone-900 hover:bg-stone-900/5
              transition-all duration-150"
                    >
                        Log in
                    </Link>

                    <div className="hidden sm:block w-px h-4 bg-stone-200" />

                    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                        <Link
                            href="#join"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg
                bg-stone-900 text-white text-sm font-semibold
                hover:bg-stone-800 transition-colors shadow-sm"
                        >
                            Get started
                            <span className="text-stone-400 text-xs">→</span>
                        </Link>
                    </motion.div>
                </div>

            </div>
        </nav>
    );
}