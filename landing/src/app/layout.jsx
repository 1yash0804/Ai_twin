import "./globals.css";

export const metadata = {
    title: "TwinLabs — AI Chief of Staff for Work Conversations",
    description: "TwinLabs turns work conversations across chat platforms into structured tasks, tracked commitments, and operational memory — automatically.",
    keywords: "Chat-based work, operational intelligence, TwinLabs, task extraction, business automation, Slack, WhatsApp, Telegram",
    openGraph: {
        title: "TwinLabs — AI Chief of Staff for Work Conversations",
        description: "Operational Intelligence Layer for Chat-Based Work.",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased font-sans">{children}</body>
        </html>
    );
}
