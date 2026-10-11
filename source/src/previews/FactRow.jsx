const { FactRow } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ul className="pv-col pv-narrow">
  <FactRow icon="secret">Won’t keep secrets from you</FactRow>
  <FactRow icon="house" delay={150}>Won’t ask where you live</FactRow>
  <FactRow icon="mic" answer="No" delay={300}>Saves voice recordings?</FactRow>
</ul>);
