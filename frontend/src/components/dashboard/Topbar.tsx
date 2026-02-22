"use client";
import { Bell, Search } from "lucide-react";

export default function Topbar() {
    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-md bg-white/80">
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-80 shadow-sm focus-within:border-indigo-600/50 transition-colors">
                <Search className="w-4 h-4 text-slate-400 font-bold" />
                <input
                    type="text"
                    placeholder="Search commitments..."
                    className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-400 w-full font-medium"
                />
            </div>

            <div className="flex items-center gap-8">
                <button className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                    <Bell className="w-4.5 h-4.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
                </button>

                <div className="h-6 w-px bg-slate-200" />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">Yash Singh</p>
                        <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">Founder Workspace</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm">
                        YS
                    </div>
                </div>
            </div>
        </header>
    );
}
