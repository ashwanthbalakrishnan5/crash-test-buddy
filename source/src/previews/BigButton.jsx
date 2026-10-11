const { BigButton } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-row">
  <BigButton icon="scan" pulse>Scan a toy</BigButton>
  <BigButton variant="secondary" icon="flag">Report a problem</BigButton>
  <BigButton size="md" icon="shield">Add Safety Shield</BigButton>
  <BigButton variant="quiet" size="md" icon="play">Watch the demo</BigButton>
</div>);
