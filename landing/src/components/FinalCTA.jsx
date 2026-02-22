"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
    {
        q: "How does TwinLabs access my chat apps?",
        a: "TwinLabs uses secure, sandboxed connections to monitor only the threads you specify across platforms like Slack, WhatsApp, and Telegram."
    },
    {
        q: "Is my data secure?",
        a: "Beyond industry-standard encryption, TwinLabs only processes text for intent extraction. We do not store full message histories or private media. Your data is treated as high-security operational intelligence."
    },
    {
        q: "Can I control what gets extracted?",
        a: "Absolutely. You can whitelist specific contacts or groups for monitoring. TwinLabs ignores everything else, ensuring your personal conversations remain private."
    },
    {
        q: "Does it reply automatically?",
        a: "No. TwinLabs is strictly an operational layer. It identifies commitments and surfaces them to your dashboard. It never speaks on your behalf without explicit configuration and approval."
    },
    {
        q: "Can I disable monitoring anytime?",
        a: "Yes. You have a master switch to pause or disconnect monitoring instantly. You are in full control of the system at all times."
    },
];

function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-6 text-left text-gray-900 font-bold text-base hover:text-gray-500 transition-colors cursor-pointer tracking-tight"
            >
                <span>{q}</span>
                <span className={`text-gray-300 text-2xl transition-transform duration-300 ml-4 shrink-0 font-light ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
            >
                <p className="pb-6 text-base text-gray-500 leading-relaxed max-w-xl">{a}</p>
            </motion.div>
        </div>
    );
}

export default function FinalCTA() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email) return;
        setSubmitted(true);
    };

    return (
        <>
            <section className="py-40 bg-white" id="early-access">
                <div className="max-w-4xl mx-auto px-6 text-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center self-center gap-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-12 shadow-xl"
                    >
                        Early Access — Limited Spots
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tighter mb-8 leading-[1.05]"
                    >
                        Run Your Chat Like a System.<br />
                        Not a Information Dump.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-500 mb-16 text-xl max-w-2xl mx-auto"
                    >
                        TwinLabs gives you operational clarity without adding complexity. Join the waitlist today.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-md mx-auto"
                    >
                        {submitted ? (
                            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
                                <div className="text-4xl mb-6 grayscale">✅</div>
                                <h3 className="font-extrabold text-gray-900 text-2xl mb-4 tracking-tight">You&apos;re on the list.</h3>
                                <p className="text-gray-500 font-medium">We&apos;ll notify {email} when your spot is ready.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 text-left space-y-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gray-900" />
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 text-gray-900 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Work Email</label>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 text-gray-900 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-medium"
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gray-900 text-white font-bold py-5 rounded-xl text-lg hover:bg-black transition-all shadow-xl cursor-pointer"
                                >
                                    Request Early Access
                                </motion.button>
                                <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest underline decoration-gray-100 underline-offset-4">No credit card required. No generic AI spam.</p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="py-32 bg-gray-50" id="faq">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Technical & Security FAQ</h2>
                        <p className="text-gray-500 font-medium">Everything you need to know about how TwinLabs handles your data.</p>
                    </motion.div>
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} {...faq} />
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                                <path d="M7 2L3 4.5V9.5L7 12L11 9.5V4.5L7 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-900 tracking-tighter">TwinLabs</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400">© 2026 TwinLabs. Operational Intelligence for Chat.</p>
                    <div className="flex gap-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
