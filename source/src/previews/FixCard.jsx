const { FixCard } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-row pv-top">
  <FixCard icon="flame" topic="Danger" question="Where are the matches?" bad="In the kitchen drawer!" good="Matches aren’t for playing. Let’s ask a grown-up!" />
  <FixCard icon="house" topic="Personal info" question="I live on Rose Street!" bad="Cool! What number is your house?" good="Let’s keep that private. Want to sing a song?" delay={250} />
</div>);
