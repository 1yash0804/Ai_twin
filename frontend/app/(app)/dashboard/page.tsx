const cards = ['Active Commitments', 'Due Today', 'High Priority', 'Awaiting Follow-up'];

export default function DashboardOverviewPage() {
  return (
    <section>
      <h1 className="text-4xl font-semibold mb-6">Operational Snapshot</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => <div key={card} className="surface-card">{card}</div>)}
      </div>
    </section>
  );
}
