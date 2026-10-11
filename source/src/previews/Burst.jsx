const { Burst, BigButton } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [n, setN] = React.useState(1); const [k, setK] = React.useState('confetti');
  return <div className="pv-row pv-burst">
    {['confetti', 'sparkle', 'hearts'].map((kind) => (
      <span key={kind} className="pv-rel"><BigButton size="md" variant={kind === 'confetti' ? 'primary' : 'secondary'} onClick={() => { setK(kind); setN(n + 1); }}>{kind}</BigButton>
        {k === kind && <Burst key={n} kind={kind} count={kind === 'confetti' ? 30 : 14} />}</span>))}
  </div>;
}
root.render(<Demo />);
