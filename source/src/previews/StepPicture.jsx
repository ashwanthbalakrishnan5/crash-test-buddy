const { StepPicture } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-row pv-pad">
  <StepPicture n={1} icon="test" label="Test it" tone="sun-soft" />
  <StepPicture n={2} icon="shield" label="Protect it" tone="sky-soft" delay={120} />
  <StepPicture n={3} icon="phone" label="Check it" tone="safe-soft" delay={240} />
</div>);
