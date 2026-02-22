import type { ReactNode } from 'react';
import Link from 'next/link';

const nav = [
  ['Overview', '/dashboard'],
  ['Commitments', '/dashboard/tasks'],
  ['Activity Log', '/dashboard/activity'],
  ['Client Memory', '/dashboard/memory'],
  ['Settings', '/dashboard/settings']
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5">
        <div className="font-semibold text-xl mb-6">TwinLabs</div>
        <nav className="space-y-2 text-slate-300">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="block px-3 py-2 rounded-lg hover:bg-slate-800">{label}</Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-end gap-3 text-sm text-slate-300">
          <button className="btn-secondary">Notifications</button>
          <button className="btn-secondary">Workspace</button>
          <button className="btn-secondary">Profile</button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
