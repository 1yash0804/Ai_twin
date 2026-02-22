"use client";
import { motion } from "framer-motion";

export function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.4, 0, 0.2, 1], // Simplified calm easing
            }}
        >
            {children}
        </motion.div>
    );
}

export function Stagger({ children, interval = 0.08 }: { children: React.ReactNode; interval?: number }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: interval,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}
