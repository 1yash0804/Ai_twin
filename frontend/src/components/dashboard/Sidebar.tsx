"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, CheckSquare, Activity,
    Brain, Settings, Send,
} from "lucide-react";

const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Commitments", href: "/dashboard/tasks", icon: CheckSquare },
    { label: "Activity Log", href: "/dashboard/activity", icon: Activity },
    { label: "Client Memory", href: "/dashboard/memory", icon: Brain },
    { label: "Telegram", href: "/dashboard/telegram", icon: Send },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="
      hidden lg:flex flex-col h-screen sticky top-0
      w-64 xl:w-72
      bg-white       border-r border-slate-200/90
      dark:bg-zinc-900 dark:border-zinc-800
      transition-colors duration-200
    ">
            {/* Logo */}
            <div className="
        h-16 flex items-center gap-3 px-6
        border-b border-slate-100/80 dark:border-zinc-800
      ">
                <div className="
          w-8 h-8 rounded-lg flex items-center justify-center
          bg-indigo-600 dark:bg-indigo-500
        ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="
          font-bold text-lg tracking-tight
          text-slate-900 dark:text-zinc-100
        ">
                    TwinLabs
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 xl:p-6 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-150 font-semibold text-sm group
                ${isActive
                                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-zinc-500 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                                }
              `}
                        >
                            <item.icon className={`
                w-4 h-4 transition-colors
                ${isActive
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-600 dark:group-hover:text-zinc-400"
                                }
              `} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Live status footer */}
            <div className="p-4 xl:p-6 border-t border-slate-100 dark:border-zinc-800">
                <div className="
          p-4 rounded-2xl border shadow-sm
          bg-slate-50  border-slate-100  shadow-slate-200/40
          dark:bg-zinc-800 dark:border-zinc-700 dark:shadow-none
        ">
                    <p className="
            text-[10px] font-black uppercase tracking-widest mb-2
            text-slate-400 dark:text-zinc-500
          ">
                        Live Status
                    </p>
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <p className="text-xs font-bold tracking-tight text-slate-700 dark:text-zinc-300">
                            Extraction Active
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}