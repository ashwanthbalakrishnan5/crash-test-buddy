const { Buddy } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-row">
  <figure><Buddy pose="wave" size={190} track /><figcaption className="small">wave · follows your pointer</figcaption></figure>
  <figure><Buddy pose="shield" size={190} /><figcaption className="small">shield</figcaption></figure>
  <figure><Buddy pose="cheer" size={190} /><figcaption className="small">cheer</figcaption></figure>
  <figure><Buddy pose="shield" mood="worried" size={190} /><figcaption className="small">worried</figcaption></figure>
  <figure><Buddy crop="head" size={96} /><figcaption className="small">head</figcaption></figure>
</div>);
