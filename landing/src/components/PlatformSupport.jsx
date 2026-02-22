"use client";
import { motion } from "framer-motion";

const platforms = [
    "WhatsApp",
    "Slack",
    "Telegram",
    "Discord (Coming Soon)",
    "iMessage (Planned)",
];

export default function PlatformSupport() {
    return (
        <section className="py-12 bg-white border-b border-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Works With</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
                        {platforms.map((platform, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="text-xs font-bold text-gray-300 uppercase tracking-widest hover:text-gray-900 transition-colors cursor-default"
                            >
                                {platform}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
