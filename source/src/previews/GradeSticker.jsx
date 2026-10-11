const { GradeSticker } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-row pv-pad">
  <GradeSticker grade="A" size="lg" />
  {['B', 'C', 'D', 'F'].map((g, i) => <GradeSticker key={g} grade={g} size="md" delay={150 * (i + 1)} />)}
  <GradeSticker grade="A" size="sm" word={false} delay={800} />
</div>);
