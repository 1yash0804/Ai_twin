"use client";

import { useState } from "react";
import { Send, ExternalLink, CheckCircle2 } from "lucide-react";

interface TelegramConnectButtonProps {
    token: string;
}

export function TelegramConnectButton({ token }: TelegramConnectButtonProps) {
    const [link, setLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

            const res = await fetch(apiUrl + "/me/telegram/connect-link", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            const data = (await res.json()) as { link: string };
            setLink(data.link);

            // Open Telegram immediately
            window.open(data.link, "_blank");

            // Poll every 3 seconds to detect connection
            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(apiUrl + "/me/stats", {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    });
                    const stats = (await statusRes.json()) as { telegram_connected: boolean };
                    if (stats.telegram_connected) {
                        setConnected(true);
                        clearInterval(interval);
                    }
                } catch {
                    // silently ignore polling errors
                }
            }, 3000);

            // Stop polling after 5 minutes
            setTimeout(() => clearInterval(interval), 300_000);
        } catch (err) {
            console.error("Failed to get connect link", err);
        } finally {
            setLoading(false);
        }
    };

    if (connected) {
        return (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
        bg-emerald-50 border border-emerald-200 text-emerald-700
        dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 size={14} />
                <span className="text-sm font-bold">Telegram connected</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
          bg-blue-500 text-white text-sm font-bold
          hover:bg-blue-600 transition-colors
          disabled:opacity-60 shadow-sm shadow-blue-500/20"
            >
                <Send size={14} />
                {loading ? "Generating link..." : "Connect Telegram"}
                <ExternalLink size={12} className="opacity-60" />
            </button>

            {link && (
                <p className="text-xs text-stone-400 dark:text-zinc-500 font-medium">
                    Telegram opened. Come back here once you&apos;ve started the bot.
                </p>
            )}
        </div>
    );
}