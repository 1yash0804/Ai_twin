"use client";
import { motion } from "framer-motion";

const whoFor = [
    "Startup founders running operations through chat",
    "Agencies managing multiple client threads",
    "Sales professionals tracking commitments",
    "Small teams coordinating work in various apps",
];

const whoNotFor = [
    "Casual chat users",
    "Personal conversation automation",
    "Users looking for an AI chatbot to reply for them",
    "Teams with zero work commitments in chat",
];

export default function WhoItIsFor() {
    return (
        <section className="py-32 bg-gray-50" id="who">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-12"
                    >
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Who TwinLabs Is For</h2>
                        <div className="space-y-6">
                            {whoFor.map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-1">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 tracking-tight">{item}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-12"
                    >
                        <h2 className="text-4xl font-extrabold text-gray-300 tracking-tight">Who This Is Not For</h2>
                        <div className="space-y-6">
                            {whoNotFor.map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-1">
                                        <div className="w-2 h-0.5 bg-gray-200 rounded-full" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-400 tracking-tight">{item}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
