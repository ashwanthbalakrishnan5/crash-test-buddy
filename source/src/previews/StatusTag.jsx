const { StatusTag } = window.CTB;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div className="pv-col">
  <div className="pv-row"><StatusTag status="safe" /><StatusTag status="careful" /><StatusTag status="unsafe" /><StatusTag status="testing" /><StatusTag status="waiting" /></div>
  <div className="pv-row"><StatusTag status="safe" size="lg">Safe to play</StatusTag><StatusTag status="unsafe" size="lg" /></div>
</div>);
