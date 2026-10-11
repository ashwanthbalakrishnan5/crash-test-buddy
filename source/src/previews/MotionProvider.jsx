const { MotionProvider, Buddy, StatusTag, BigButton } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [calm, setCalm] = React.useState(false);
  return <MotionProvider calm={calm} className="pv-col pv-pad">
    <div className="pv-row"><Buddy pose="cheer" size={140} /><StatusTag key={String(calm)} status="safe" stamp size="lg">Safe to play</StatusTag></div>
    <BigButton variant="secondary" size="md" icon="calm" onClick={() => setCalm(!calm)}>{calm ? 'Motion on' : 'Less motion'}</BigButton>
  </MotionProvider>;
}
root.render(<Demo />);
