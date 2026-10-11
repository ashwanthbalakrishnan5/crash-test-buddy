const { ShipmentBox } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [s, setS] = React.useState('unsafe');
  const add = () => { setS('fixing'); setTimeout(() => setS('safe'), 1500); };
  return <div className="pv-row pv-top pv-pad">
    <ShipmentBox id="4471" count="5,000" toy="bear" toyName="Cuddle Bears" status={s} grade={s === 'safe' ? 'A' : 'F'} onAddShield={add} />
    <ShipmentBox id="4474" count="1,200" toy="bunny" toyName="Bunny Buds" status="testing" progress={63} delay={150} />
  </div>;
}
root.render(<Demo />);
