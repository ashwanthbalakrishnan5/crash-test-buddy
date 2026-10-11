const { FamilyArt } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-row">
  {['mom-kid', 'dad-kid', 'grandma-kid'].map((f) => <figure key={f}><FamilyArt family={f} size={200} title={f} /><figcaption className="small">{f}</figcaption></figure>)}
  {['kid-puffs', 'kid-braids', 'kid-curly'].map((f) => <figure key={f}><FamilyArt family={f} size={84} title={f} /><figcaption className="small">{f}</figcaption></figure>)}
</div>);
