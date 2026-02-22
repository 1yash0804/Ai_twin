export default function MemoryPage() {
  return (
    <section>
      <h1 className="text-4xl font-semibold mb-6">Client Memory</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="surface-card">Acme prefers Friday status updates.</div>
        <div className="surface-card">North Labs decision-maker: Priya.</div>
      </div>
    </section>
  );
}
