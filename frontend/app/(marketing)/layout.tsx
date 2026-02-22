import type { ReactNode } from 'react';
import Link from 'next/link';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="container-shell h-16 flex items-center justify-between">
          <div className="font-semibold text-xl">TwinLabs</div>
          <nav className="flex items-center gap-6 text-slate-300">
            <Link href="#capabilities">Capabilities</Link>
            <Link href="#who-for">Who it's for</Link>
            <button className="btn-primary">Join Early Access</button>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-800 py-10 mt-20">
        <div className="container-shell grid md:grid-cols-4 gap-6 text-slate-400 text-sm">
          <div>Product</div><div>Security</div><div>Legal</div><div>Contact</div>
        </div>
      </footer>
    </div>
  );
}
