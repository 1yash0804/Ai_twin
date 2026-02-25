"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { requestSignupOtp, verifySignupOtp, login } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  // Step 1 fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 field
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Step 1 — request OTP
  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestSignupOtp({ username, email, password });
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP, create account, auto-login
  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifySignupOtp(email, otp);
      const session = await login(username, password);
      saveToken(session.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <FadeUp>
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/50">

          {/* Header */}
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {step === 1 ? "Create your account" : "Verify your email"}
            </h1>
            <p className="text-slate-500 font-medium">
              {step === 1
                ? "Connect your frontend to the AI Twin backend in one step."
                : `We sent a 6-digit code to ${email}. Enter it below.`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${s <= step ? "bg-indigo-600" : "bg-slate-100"
                  }`}
              />
            ))}
          </div>

          {/* Step 1 — Account details */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleRequestOtp}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Username
                </label>
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="yash@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                />
              </div>

              {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending code..." : "Continue"}
              </motion.button>
            </form>
          )}

          {/* Step 2 — OTP entry */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-bold text-2xl tracking-[0.5em] text-center"
                />
              </div>

              {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading || otp.length !== 6}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Create Account"}
              </motion.button>

              <button
                type="button"
                onClick={() => { setStep(1); setError(null); setOtp(""); }}
                className="w-full text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors"
              >
                ← Back and resend
              </button>
            </form>
          )}

          <p className="text-center mt-10 text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </FadeUp>
    </div>
  );
}