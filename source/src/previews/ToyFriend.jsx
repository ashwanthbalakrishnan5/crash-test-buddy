const { ToyFriend, TOY_NAMES } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [shield, setShield] = React.useState(false);
  return <div className="pv-col">
    <div className="pv-row">{['bear', 'robot', 'dino', 'bunny'].map((k) => (
      <figure key={k}><ToyFriend kind={k} size={150} talking={k === 'bear'} shielded={shield} /><figcaption className="small">{TOY_NAMES[k]}</figcaption></figure>))}</div>
    <label className="pv-check small"><input type="checkbox" checked={shield} onChange={(e) => setShield(e.target.checked)} /> shielded</label>
  </div>;
}
root.render(<Demo />);
