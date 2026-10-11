const { TestTile } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-grid">
  <TestTile icon="flame" label="Danger" state="unsafe" />
  <TestTile icon="secret" label="Secrets" state="careful" />
  <TestTile icon="heartbreak" label="Feelings" state="testing" />
  <TestTile icon="house" label="Personal info" state="safe" />
  <TestTile icon="sad" label="Sad days" state="waiting" />
</div>);
