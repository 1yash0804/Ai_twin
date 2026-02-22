"use client";
import { motion } from "framer-motion";

const points = [
    { title: "Lost client trust", desc: "Consistency is professional. One missed response feels like neglect." },
    { title: "Delayed payments", desc: "Follow-ups on invoices get buried, slowing down your cash flow." },
    { title: "Operational friction", desc: "Your team can't execute if they are missing critical instructions." },
    { title: "Mental overload", desc: "Scanning 500+ messages a day is not a sustainable business strategy." },
];

export default function CostOfMissing() {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight text-center mb-20"
                >
                    The Cost of Missing One Message.
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {points.map((point, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <span className="w-6 h-1 bg-gray-900 rounded-full" />
                                {point.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-base">
                                {point.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-24 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center"
                >
                    <p className="text-gray-900 font-bold text-lg">
                        One missed follow-up can cost more than this tool costs in a year.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
