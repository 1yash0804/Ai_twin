"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Activity, Brain, Settings } from "lucide-react";

const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Commitments", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Activity Log", href: "/dashboard/activity", icon: Activity },
    { label: "Client Memory", href: "/dashboard/memory", icon: Brain },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-slate-200/90 flex-col h-screen sticky top-0">
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100/80">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">TwinLabs</span>
            </div>

            <nav className="flex-1 p-4 xl:p-6 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm group ${isActive
                                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 xl:p-6 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/40">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Status</p>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <p className="text-xs font-bold text-slate-700 tracking-tight">Extraction Active</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
