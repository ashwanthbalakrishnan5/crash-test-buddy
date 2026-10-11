const { TopMenu } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [cur, setCur] = React.useState('home'); const [calm, setCalm] = React.useState(false);
  return <div className="ctb-motion pv-menu"><TopMenu items={[{ id: 'home', label: 'Home', icon: 'house' }, { id: 'ships', label: 'Shipments', icon: 'box' }]} current={cur} onSelect={setCur} calm={calm} onCalmChange={setCalm} /></div>;
}
root.render(<Demo />);
