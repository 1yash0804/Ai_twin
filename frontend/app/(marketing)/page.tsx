export default function MarketingPage() {
  return (
    <main>
      <section className="section-pad container-shell grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-semibold tracking-tight">WhatsApp Was Built for Chat. Not for Running a Business.</h1>
          <p className="text-lg text-slate-300">TwinLabs automatically extracts tasks, deadlines, and commitments from work conversations — so nothing slips through the cracks.</p>
          <div className="flex gap-3"><button className="btn-primary">Join Early Access</button><button className="btn-secondary">See How It Works</button></div>
          <p className="text-sm text-slate-500">No credit card required · Works with WhatsApp Business · Setup in minutes</p>
        </div>
        <div className="surface-card">Operational dashboard preview</div>
      </section>

      <section className="section-pad container-shell">
        <h2 className="text-3xl font-semibold mb-3">Your Business Lives Inside WhatsApp.</h2>
        <p className="text-slate-400 mb-8">The information existed. The system did not.</p>
        <div className="surface-card">
          <h3 className="text-2xl font-medium mb-4">The Cost of Missing One Message</h3>
          <ul className="grid md:grid-cols-2 gap-3 text-slate-300">
            <li>Lost client trust</li><li>Delayed payments</li><li>Operational friction</li><li>Mental overload</li>
          </ul>
          <p className="mt-4 text-slate-400">One missed follow-up can cost more than this tool costs in a year.</p>
        </div>
      </section>

      <section id="capabilities" className="section-pad container-shell">
        <h2 className="text-3xl font-semibold">Core Capabilities</h2>
        <p className="text-slate-400 mt-3">TwinLabs handles the operational layer of your business so you can focus on execution.</p>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {['Automatic Commitment Detection','Deadline Inference','Structured Task Creation','Follow-up Tracking','Client Memory Context'].map((x)=><div key={x} className="surface-card">{x}</div>)}
        </div>
      </section>

      <section id="who-for" className="section-pad container-shell grid md:grid-cols-2 gap-8">
        <div className="surface-card"><h3 className="text-2xl mb-3">Who this is for</h3><ul className="space-y-2 text-slate-300"><li>Startup founders running operations through WhatsApp</li><li>Agencies managing multiple client threads</li><li>Sales professionals tracking commitments</li><li>Small teams coordinating work in chat</li></ul></div>
        <div className="surface-card"><h3 className="text-2xl mb-3">Who this is not for</h3><ul className="space-y-2 text-slate-300"><li>Casual WhatsApp users</li><li>Personal chat automation</li><li>Students managing group chats</li><li>Users looking for a chatbot</li></ul></div>
      </section>

      <section className="section-pad container-shell text-center">
        <h2 className="text-4xl font-semibold">Run WhatsApp Like a System. Not a Message Dump.</h2>
        <p className="text-slate-400 mt-3">TwinLabs gives you operational clarity without adding complexity.</p>
        <button className="btn-primary mt-6">Join Early Access</button>
        <p className="text-sm text-slate-500 mt-4">TwinLabs integrates only via WhatsApp Business API. We do not access personal chats. All data is encrypted and tenant-isolated.</p>
      </section>
    </main>
  );
}
