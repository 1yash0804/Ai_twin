"use client";
import { motion } from "framer-motion";

export default function SocialProof() {
    return (
        <section className="py-20 bg-white border-y border-gray-100">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-lg font-medium text-gray-500 max-w-2xl leading-relaxed"
                >
                    Join 47 early-stage founders and agency owners already testing TwinLabs to reclaim their operational clarity.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-8 flex -space-x-3"
                >
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                            User
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-white bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
                        +42
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
