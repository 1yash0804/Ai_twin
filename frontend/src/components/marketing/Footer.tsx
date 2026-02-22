"use client";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-100 py-24">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                <div className="col-span-1 md:col-span-1 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/10">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">TwinLabs</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        The operational intelligence layer for businesses that run on WhatsApp.
                    </p>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Product</h4>
                    <ul className="space-y-4 text-sm font-medium text-slate-500">
                        <li><Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                        <li><Link href="#security" className="hover:text-indigo-600 transition-colors">Security</Link></li>
                        <li><Link href="/login" className="hover:text-indigo-600 transition-colors">Log In</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Company</h4>
                    <ul className="space-y-4 text-sm font-medium text-slate-500">
                        <li><Link href="#" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Contact</h4>
                    <ul className="space-y-4 text-sm font-medium text-slate-500">
                        <li><Link href="mailto:hello@twinlabs.ai" className="hover:text-indigo-600 transition-colors">hello@twinlabs.ai</Link></li>
                        <li><Link href="#" className="hover:text-indigo-600 transition-colors">WhatsApp Support</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-24 pt-12 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 TwinLabs. All rights reserved.</p>
                <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Link href="#" className="hover:text-slate-900 transition-colors">Twitter</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">LinkedIn</Link>
                </div>
            </div>
        </footer>
    );
}
