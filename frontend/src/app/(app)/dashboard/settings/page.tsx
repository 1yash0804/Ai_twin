"use client";
import { FadeUp } from "@/components/animation/MotionWrappers";
import { Settings, Shield, Bell, User, MessageCircle } from "lucide-react";

const settingSections = [
    { title: "Profile Settings", desc: "Manage your personal information and preferences.", icon: User },
    { title: "Notifications", desc: "Configure how and when you want to be notified.", icon: Bell },
    { title: "WhatsApp Integration", desc: "Manage your connection to the WhatsApp Business API.", icon: MessageCircle },
    { title: "Security", desc: "Access controls, logs, and authentication settings.", icon: Shield },
];

export default function SettingsPage() {
    return (
        <div className="p-10 space-y-16 bg-slate-50/50 min-h-full">
            <FadeUp>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-base text-slate-500 font-medium">Configure your TwinLabs experience and account.</p>
                </div>
            </FadeUp>

            <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {settingSections.map((s, i) => (
                    <FadeUp key={i} delay={i * 0.08}>
                        <button className="text-left bg-white border border-slate-200 p-10 rounded-[3rem] group hover:border-indigo-600/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5 relative overflow-hidden flex flex-col items-start gap-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <s.icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{s.title}</h3>
                                <p className="text-base text-slate-500 leading-relaxed font-medium">{s.desc}</p>
                            </div>
                        </button>
                    </FadeUp>
                ))}
            </div>
        </div>
    );
}
