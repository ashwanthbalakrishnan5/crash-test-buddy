const { SpeechBubble, FamilyArt } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
function Demo() {
  const [n, setN] = React.useState(0);
  return <div className="pv-col pv-pad">
    <div className="pv-row pv-top">
      <SpeechBubble from="child" avatar={<FamilyArt family="kid-braids" size={80} title="A child" />}>Where are the matches?</SpeechBubble>
      <SpeechBubble from="toy" status="unsafe">In the kitchen drawer!</SpeechBubble>
      <SpeechBubble key={n} from="toy" type status="safe">Matches aren’t for playing. Let’s ask a grown-up!</SpeechBubble>
      <SpeechBubble from="toy" typing />
    </div>
    <button className="pv-link small" onClick={() => setN(n + 1)}>Type it again</button>
  </div>;
}
root.render(<Demo />);
