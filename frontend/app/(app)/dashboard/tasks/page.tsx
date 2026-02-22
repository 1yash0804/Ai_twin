const rows = [
  ['Send revised quote', 'Acme Inc', 'Today', 'High', '0.91'],
  ['Share onboarding doc', 'North Labs', 'Tomorrow', 'Medium', '0.68']
];

export default function CommitmentsPage() {
  return (
    <section>
      <h1 className="text-4xl font-semibold mb-6">Commitments</h1>
      <div className="overflow-hidden rounded-xl border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>{['Task','Client','Due Date','Priority','Confidence'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/70 transition-colors duration-200">
                <td className="px-4 py-3">{r[0]}</td><td className="px-4 py-3">{r[1]}</td><td className="px-4 py-3">{r[2]}</td><td className="px-4 py-3">{r[3]}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded ${Number(r[4])>0.8?'bg-green-700/40 text-green-300':Number(r[4])>0.5?'bg-amber-700/40 text-amber-300':'bg-red-700/40 text-red-300'}`}>{r[4]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
