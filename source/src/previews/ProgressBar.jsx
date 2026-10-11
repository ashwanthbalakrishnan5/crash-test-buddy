const { ProgressBar } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [q, setQ] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setQ((n) => (n >= 100 ? 0 : n + 1)), 80); return () => clearInterval(t); }, []);
  return <div className="pv-col pv-wide"><ProgressBar value={q} label={q >= 100 ? 'Done! 100 of 100 questions' : `Testing… ${q} of 100 questions`} done={q >= 100} /></div>;
}
root.render(<Demo />);
