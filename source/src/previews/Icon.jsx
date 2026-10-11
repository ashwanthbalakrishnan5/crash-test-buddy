const { Icon, ICON_NAMES } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-icons">{ICON_NAMES.map((n) => <figure key={n}><Icon name={n} size={48} /><figcaption className="small">{n}</figcaption></figure>)}</div>);
