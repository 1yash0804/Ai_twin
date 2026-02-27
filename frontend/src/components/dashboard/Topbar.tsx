"use client";

import { Bell, LogOut, Search, Sun, Moon } from "lucide-react";
import { clearToken, getToken, getUsernameFromToken } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const username = getUsernameFromToken(getToken()) ?? "User";
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <header className="
      h-16 sticky top-0 z-20
      flex items-center justify-between px-4 sm:px-6 lg:px-8
      backdrop-blur-md
      bg-white/90       border-b border-slate-200/80
      dark:bg-zinc-900/80 dark:border-zinc-800
      transition-colors duration-200
    ">
      {/* Search */}
      <div className="
        hidden md:flex items-center gap-3 w-full max-w-sm
        rounded-xl px-4 py-2 transition-colors
        bg-slate-50  border border-slate-200  focus-within:border-indigo-400
        dark:bg-zinc-800 dark:border-zinc-700 dark:focus-within:border-indigo-500
        shadow-sm
      ">
        <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Search commitments..."
          className="
            bg-transparent border-none outline-none w-full text-sm font-medium
            text-slate-900 placeholder-slate-400
            dark:text-zinc-100 dark:placeholder-zinc-500
          "
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1 sm:gap-2 ml-auto">

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="
            p-2.5 rounded-xl transition-colors
            hover:bg-slate-100 dark:hover:bg-zinc-800
            group
          "
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
          ) : (
            <Moon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          )}
        </button>

        {/* Notifications */}
        <button className="
          relative p-2.5 rounded-xl transition-colors
          hover:bg-slate-100 dark:hover:bg-zinc-800 group
        ">
          <Bell className="
            w-4 h-4 transition-colors
            text-slate-400 group-hover:text-slate-900
            dark:text-zinc-500 dark:group-hover:text-zinc-100
          " />
          <span className="
            absolute top-2.5 right-2.5 w-2 h-2 rounded-full
            bg-indigo-500 border-2
            border-white dark:border-zinc-900
          " />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            p-2.5 rounded-xl transition-colors
            hover:bg-slate-100 dark:hover:bg-zinc-800 group
          "
          aria-label="Logout"
        >
          <LogOut className="
            w-4 h-4 transition-colors
            text-slate-400 group-hover:text-slate-900
            dark:text-zinc-500 dark:group-hover:text-zinc-100
          " />
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-px mx-1 bg-slate-200 dark:bg-zinc-800" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none text-slate-900 dark:text-zinc-100">
              {username}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1.5
              text-indigo-600 dark:text-indigo-400 opacity-80">
              Connected Workspace
            </p>
          </div>
          <div className="
            w-10 h-10 rounded-xl flex items-center justify-center
            text-xs font-black shadow-sm
            bg-indigo-50  border border-indigo-100  text-indigo-600
            dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400
          ">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}