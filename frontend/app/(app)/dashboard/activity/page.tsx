export default function ActivityPage() {
  return (
    <section>
      <h1 className="text-4xl font-semibold mb-6">Extraction Log</h1>
      <div className="border-l border-indigo-500/50 pl-6 space-y-4">
        <div className="surface-card">Detected commitment from Acme chat.</div>
        <div className="surface-card">Inferred deadline: Friday EOD.</div>
        <div className="surface-card">Created follow-up reminder.</div>
      </div>
    </section>
  );
}
