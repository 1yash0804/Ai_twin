export default function SettingsPage() {
  return (
    <section>
      <h1 className="text-4xl font-semibold mb-6">Settings</h1>
      <div className="surface-card space-y-4">
        <p className="text-slate-300">TwinLabs integrates only via WhatsApp Business API. We do not access personal chats.</p>
        <p className="text-slate-400">All data is encrypted and tenant-isolated.</p>
      </div>
    </section>
  );
}
