const { ShieldSwitch } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() { const [on, setOn] = React.useState(false); return <div className="pv-row"><ShieldSwitch on={on} onChange={setOn} /></div>; }
root.render(<Demo />);
