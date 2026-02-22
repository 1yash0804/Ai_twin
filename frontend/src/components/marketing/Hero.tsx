"use client";
import Link from "next/link";
import { FadeUp, Stagger } from "@/components/animation/MotionWrappers";
import { HeroMockup } from "./HeroMockup";

export default function Hero() {
    return (
        <section className="relative pt-24 pb-32 overflow-hidden bg-white">
            {/* Subtle background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
                <Stagger interval={0.1}>
                    <div className="space-y-8">
                        <FadeUp>
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-semibold text-indigo-600 uppercase tracking-widest">
                                <span className="w-1 h-1 bg-indigo-600 rounded-full" />
                                Early Access — Limited Spots
                            </span>
                        </FadeUp>

                        <div className="space-y-6">
                            <FadeUp>
                                <h1 className="text-5xl lg:text-7xl font-semibold text-slate-900 leading-[1.05] tracking-tight">
                                    WhatsApp Was Built for Chat.<br />
                                    <span className="text-slate-400">Not for Running a Business.</span>
                                </h1>
                            </FadeUp>

                            <FadeUp delay={0.1}>
                                <p className="text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
                                    TwinLabs automatically extracts tasks, deadlines, and commitments from work conversations — so nothing slips through the cracks.
                                </p>
                            </FadeUp>
                        </div>

                        <FadeUp delay={0.2}>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="#join"
                                    className="inline-flex justify-center items-center bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover-lift"
                                >
                                    Join Early Access
                                </Link>
                                <Link
                                    href="#how"
                                    className="inline-flex justify-center items-center border border-slate-200 bg-white text-slate-700 font-semibold px-8 py-4 rounded-xl text-base hover:bg-slate-50 transition-all hover-lift"
                                >
                                    See How It Works
                                </Link>
                            </div>
                        </FadeUp>

                        <FadeUp delay={0.3}>
                            <p className="text-sm text-slate-400 font-medium">
                                No credit card required · Works with WhatsApp Business API · Setup in minutes
                            </p>
                        </FadeUp>
                    </div>
                </Stagger>

                <div className="hidden lg:block relative">
                    <div className="absolute -inset-4 bg-slate-100/50 rounded-[3rem] blur-2xl -z-10" />
                    <HeroMockup />
                </div>
            </div>
        </section>
    );
}
