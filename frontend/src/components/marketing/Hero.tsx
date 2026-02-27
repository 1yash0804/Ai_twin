"use client";
import Link from "next/link";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { HeroMockup } from "./HeroMockup";

export default function Hero() {
    return (
        <section className="relative pt-24 pb-32 overflow-hidden bg-[#f4f2ee]">

            {/* Faint warm gradient blob */}
            <div className="absolute top-[-20%] left-[-5%] w-[50%] h-[70%]
        bg-indigo-100/30 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 lg:px-8
        grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">

                {/* Left — copy */}
                <div className="space-y-8">

                    <FadeUp>
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5
              bg-white border border-stone-200 rounded-full shadow-sm
              text-xs font-semibold text-stone-600 uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Beta · 200+ active workspaces
                        </span>
                    </FadeUp>

                    <FadeUp delay={0.08}>
                        <h1 className="text-5xl lg:text-[4.25rem] text-stone-900 leading-[1.05] tracking-tight"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Your work lives<br />
                            in chat.<br />
                            <em className="not-italic text-stone-400">That's the problem.</em>
                        </h1>
                    </FadeUp>

                    <FadeUp delay={0.16}>
                        <p className="text-lg text-stone-500 leading-relaxed max-w-md font-medium">
                            TwinLabs connects to Telegram and automatically extracts tasks,
                            deadlines, and commitments — so nothing slips through the cracks.
                        </p>
                    </FadeUp>

                    <FadeUp delay={0.22}>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link href="#join"
                                className="inline-flex justify-center items-center
                  bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm
                  hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20
                  hover:-translate-y-0.5">
                                Get started free
                            </Link>
                            <Link href="#how"
                                className="inline-flex justify-center items-center
                  border border-stone-300 bg-white text-stone-700 font-semibold
                  px-8 py-3.5 rounded-xl text-sm
                  hover:border-stone-400 transition-all hover:-translate-y-0.5">
                                See how it works
                            </Link>
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.28}>
                        <p className="text-xs text-stone-400 font-medium"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            No credit card required · Telegram integration · Setup in 5 min
                        </p>
                    </FadeUp>

                </div>

                {/* Right — mockup */}
                <div className="hidden lg:block relative">
                    <div className="absolute -inset-6 bg-stone-200/40 rounded-[3rem] blur-2xl -z-10" />
                    <HeroMockup />
                </div>

            </div>
        </section>
    );
}