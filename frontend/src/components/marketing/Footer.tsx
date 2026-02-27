"use client";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-stone-900 border-t border-stone-800 pt-20 pb-10">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Top grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16
          border-b border-stone-800">

                    {/* Brand */}
                    <div className="md:col-span-1 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg
                flex items-center justify-center">
                                <span className="text-white text-xs font-bold"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Ai
                                </span>
                            </div>
                            <span className="font-bold text-lg text-white tracking-tight"
                                style={{ fontFamily: "'DM Serif Display', serif" }}>
                                TwinLabs
                            </span>
                        </div>
                        <p className="text-sm text-stone-500 font-medium leading-relaxed">
                            AI Chief of Staff for Telegram and WhatsApp-driven businesses.
                        </p>
                    </div>

                    {/* Product */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.18em]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            Product
                        </h4>
                        <ul className="space-y-3.5">
                            {[
                                { label: "Features", href: "#features" },
                                { label: "Dashboard", href: "/dashboard" },
                                { label: "Changelog", href: "#" },
                                { label: "Log In", href: "/login" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href}
                                        className="text-sm font-medium text-stone-500
                      hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Integrations */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.18em]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            Integrations
                        </h4>
                        <ul className="space-y-3.5">
                            {[
                                { label: "Telegram", href: "#" },
                                { label: "WhatsApp (soon)", href: "#" },
                                { label: "Slack (soon)", href: "#" },
                                { label: "API docs", href: "#" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href}
                                        className="text-sm font-medium text-stone-500
                      hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-bold text-stone-600 uppercase tracking-[0.18em]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            Company
                        </h4>
                        <ul className="space-y-3.5">
                            {[
                                { label: "About", href: "#" },
                                { label: "Privacy Policy", href: "#" },
                                { label: "Terms", href: "#" },
                                { label: "hello@twinlabs.ai", href: "mailto:hello@twinlabs.ai" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href}
                                        className="text-sm font-medium text-stone-500
                      hover:text-white transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-stone-600"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        © 2026 TwinLabs. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {["Twitter", "LinkedIn"].map((s) => (
                            <Link key={s} href="#"
                                className="text-xs font-bold uppercase tracking-widest
                  text-stone-600 hover:text-white transition-colors">
                                {s}
                            </Link>
                        ))}
                        <span className="text-xs font-medium text-stone-700"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            v0.4.1 · beta
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}