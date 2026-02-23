"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login, requestSignupOtp, verifySignupOtp } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await requestSignupOtp({ username, email, password });
      setOtpRequested(true);
      setMessage(`We sent an OTP to ${email}. Enter it below to finish signup.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await verifySignupOtp({ email, otp });
      const session = await login(username, password);
      saveToken(session.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <FadeUp>
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-slate-500 font-medium">Register with email OTP verification.</p>
          </div>

          <form className="space-y-6" onSubmit={otpRequested ? handleVerifyOtp : handleRequestOtp}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                placeholder="yash"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={otpRequested}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                placeholder="yash@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpRequested}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={otpRequested}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium disabled:opacity-60"
              />
            </div>

            {otpRequested ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-indigo-600 transition-colors text-slate-900 font-medium"
                />
              </div>
            ) : null}

            {message ? <p className="text-sm font-semibold text-emerald-600">{message}</p> : null}
            {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : otpRequested ? "Verify OTP & Create Account" : "Send OTP"}
            </motion.button>
          </form>

          <p className="text-center mt-10 text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
