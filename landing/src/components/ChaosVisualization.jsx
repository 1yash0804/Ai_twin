"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const messages = [
    { from: "Alex", text: "Hey, can you send the updated proposal by Friday?", time: "9:12 AM" },
    { from: "Sarah", text: "Client call moved to 2 PM today instead of tomorrow.", time: "9:45 AM" },
    { from: "Mark", text: "Invoice #402 is still showing as pending.", time: "10:02 AM" },
    { from: "You", text: "On it. Will check the invoice now.", time: "10:05 AM", sent: true },
    { from: "Alex", text: "Need the marketing deck by EOD Thursday too.", time: "11:30 AM" },
    { from: "Sarah", text: "Did you get my message about the contract revision?", time: "11:45 AM" },
    { from: "Mark", text: "We need to push the Q1 review meeting back.", time: "12:10 PM" },
    { from: "Alex", text: "⚠️ Friday proposal? Did it slip through?", time: "4:30 PM", highlight: true },
];

export default function ChaosVisualization() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setVisibleCount(i);
            if (i >= messages.length) clearInterval(interval);
        }, 250); // Slower, more professional pace
        return () => clearInterval(interval);
    }, [inView]);

    return (
        <section className="py-24 bg-white border-y border-gray-50">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
                >
                    This is what your day looks like.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 mb-16 text-lg"
                >
                    Critical commitments buried inside fragmented chat threads.
                </motion.p>

                {/* Neutral Chat UI */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 bg-gray-50"
                >
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">WT</div>
                            <div className="text-left">
                                <p className="text-gray-900 font-bold text-sm leading-none">Work Thread</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Active Stream</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="p-6 space-y-4 h-[400px] overflow-hidden bg-gray-50/50">
                        {messages.slice(0, Math.max(visibleCount, 0)).map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.highlight
                                            ? "bg-gray-900 text-white font-semibold ring-4 ring-gray-900/10"
                                            : msg.sent
                                                ? "bg-white text-gray-900 border border-gray-200"
                                                : "bg-white text-gray-900 border border-gray-200"
                                        }`}
                                >
                                    {!msg.sent && (
                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-gray-400">
                                            {msg.from}
                                        </p>
                                    )}
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <p className="text-[9px] text-gray-400 mt-2 font-medium">
                                        {msg.time}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-gray-400 text-sm font-medium"
                >
                    The deadline was clear. The system to track it was not.
                </motion.p>
            </div>
        </section>
    );
}
