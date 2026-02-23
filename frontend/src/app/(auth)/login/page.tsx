"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(username, password);
      saveToken(data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <FadeUp>
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10 space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Sign in to connect with your AI Twin backend.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                placeholder="yash"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
              />
            </div>

            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <p className="text-center mt-10 text-sm font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-bold hover:text-indigo-700">Create one</Link>
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
