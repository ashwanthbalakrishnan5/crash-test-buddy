// Builds the design-system files under out/project and a local test harness under test/.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, 'out/project');
const test = path.join(root, 'test');
fs.mkdirSync(path.join(out, 'components'), { recursive: true });
fs.mkdirSync(test, { recursive: true });

const COMPONENTS = ['Buddy', 'ToyFriend', 'FamilyArt', 'Icon', 'BigButton', 'ShieldSwitch', 'TopMenu', 'StatusTag', 'GradeSticker',
  'SpeechBubble', 'TestTile', 'ProgressBar', 'BeforeAfter', 'FixCard', 'ShipmentBox', 'FactRow', 'StepPicture', 'Burst', 'MotionProvider'];

async function compile(entry) {
  const r = await build({
    entryPoints: [path.join(root, 'src', entry)], bundle: true, write: false, format: 'iife', target: 'es2019',
    jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', charset: 'utf8', legalComments: 'none',
  });
  let js = r.outputFiles[0].text;
  if (/<\/script|<!--/i.test(js)) throw new Error(entry + ' contains </script or <!--');
  return js;
}

const header = '/* @ds-bundle: ' + JSON.stringify({ format: 4, namespace: 'CTB', components: COMPONENTS.map((name) => ({ name })) }) + ' */\n';
const bundle = header + (await compile('components.jsx'));
fs.writeFileSync(path.join(out, 'components/bundle.js'), bundle);
const css = fs.readFileSync(path.join(root, 'src/bundle.css'), 'utf8');
fs.writeFileSync(path.join(out, 'components/bundle.css'), css);
fs.mkdirSync(path.join(out, 'components/src'), { recursive: true });
fs.copyFileSync(path.join(root, 'src/components.jsx'), path.join(out, 'components/src/components.jsx'));

const proto = await compile('prototype.jsx');
const protoCss = fs.readFileSync(path.join(root, 'src/prototype.css'), 'utf8');
fs.mkdirSync(path.join(out, 'components/Prototype'), { recursive: true });
const protoHtml = `<!-- @dsCard group="Prototype" height=960 width=1280 page subtitle="Six connected screens. Click anything." -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Crash Test Buddy — clickable prototype</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800;900&display=swap">
<style>
${protoCss}
</style>
</head>
<body>
<div id="root"></div>
<script>
${proto}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(out, 'components/Prototype/preview.html'), protoHtml);

// ---------- components: README + preview ----------
const META = {
  Buddy: ['Mascot', 440], ToyFriend: ['Mascot', 300], FamilyArt: ['Mascot', 380], Icon: ['Mascot', 530],
  BigButton: ['Actions', 220], ShieldSwitch: ['Actions', 230], StepPicture: ['Actions', 300],
  StatusTag: ['Status', 170], GradeSticker: ['Status', 470], TopMenu: ['Navigation', 160],
  SpeechBubble: ['Talk', 410], TestTile: ['Crash test', 480], ProgressBar: ['Crash test', 130],
  BeforeAfter: ['Report', 230], FixCard: ['Report', 490], ShipmentBox: ['Shipments', 440], FactRow: ['Parent page', 380],
  Burst: ['Motion', 330], MotionProvider: ['Motion', 310],
};
const PV_CSS = `#root { padding: var(--space-6); }
.pv-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6); }
.pv-top { align-items: flex-start; }
.pv-col { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-4); margin: 0; padding: 0; }
.pv-pad { padding-top: var(--space-6); }
figure { margin: 0; display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
figcaption { color: var(--ink-soft); }
.pv-icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: var(--space-4); }
.pv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: var(--space-4); }
.pv-wide { max-width: 640px; } .pv-narrow { max-width: 440px; }
.pv-menu { border: 3px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; }
.pv-check { display: flex; align-items: center; gap: var(--space-2); color: var(--ink); } .pv-check input { width: 24px; height: 24px; }
.pv-link { padding: var(--space-2) 0; border: 0; background: none; color: var(--sky); font-family: var(--font-body); text-decoration: underline; cursor: pointer; }
.pv-rel { position: relative; } .pv-burst { justify-content: center; padding: var(--space-16) 0; }
.pv-row .ctb-ship { width: 440px; } .pv-row .ctb-fix { width: 340px; } .pv-row .ctb-bubble { max-width: 300px; }`;
for (const [name, [group, height]] of Object.entries(META)) {
  const dir = path.join(out, 'components', name);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(root, 'src/readmes', name + '.md'), path.join(dir, 'README.md'));
  const js = await compile('previews/' + name + '.jsx');
  fs.writeFileSync(path.join(dir, 'preview.html'), `<!-- @dsCard group="${group}" height=${height} -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${name} — preview</title>
<style>
${PV_CSS}
</style>
</head>
<body>
<div id="root"></div>
<script>
${js}
</script>
</body>
</html>
`);
}
fs.copyFileSync(path.join(root, 'src/index.d.ts'), path.join(out, 'components/index.d.ts'));
fs.mkdirSync(path.join(out, 'components/Cover'), { recursive: true });
if (fs.existsSync(path.join(root, 'src/cover.html'))) fs.copyFileSync(path.join(root, 'src/cover.html'), path.join(out, 'components/Cover/preview.html'));
if (fs.existsSync(path.join(root, 'src/README.md'))) fs.copyFileSync(path.join(root, 'src/README.md'), path.join(out, 'README.md'));

// ---------- local harness: mimic the page's frame ----------
fs.copyFileSync(path.join(root, 'src/tokens.json'), path.join(out, 'tokens.json'));
const tokens = JSON.parse(fs.readFileSync(path.join(out, 'tokens.json'), 'utf8'));
function tokensCss(t) {
  const L = [];
  const first = t.color.themes[0].id;
  const val = (v) => (typeof v === 'string' ? v : v[first]);
  const alias = (v) => (/^\{(.+)\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v);
  L.push(`:root, [data-theme="${first}"] {`);
  for (const c of t.color.tokens) L.push(`  --${c.name}: ${alias(val(c.value))};`);
  for (const s of t.shadow?.tokens || []) L.push(`  --${s.name}: ${val(s.value)};`);
  L.push('}', ':root {');
  for (const fam of ['spacing', 'radius']) for (const s of t[fam].tokens) L.push(`  --${s.name}: ${s.value};`);
  for (const [k, v] of Object.entries(t)) if (!['name', 'version', 'color', 'type', 'spacing', 'radius', 'shadow'].includes(k) && v.tokens) for (const s of v.tokens) L.push(`  --${s.name}: ${s.value};`);
  for (const [k, v] of Object.entries(t.type.families)) L.push(`  --font-${k}: ${v};`);
  L.push('}');
  for (const g of t.type.groups) for (const s of g.styles) {
    L.push(`.${s.name} {`, `  font-family: var(--font-${s.family || g.family});`, `  font-size: ${s.fontSize};`, `  line-height: ${s.lineHeight};`, `  font-weight: ${s.fontWeight};`, `  letter-spacing: ${s.letterSpacing || 'normal'};`, '}');
  }
  return L.join('\n') + '\n';
}
const fsrc = (p) => 'file://' + path.join(root, 'node_modules/@fontsource', p);
const fontFaces = [600, 700, 800].map((w) => `@font-face{font-family:"Baloo 2";font-weight:${w};src:url(${fsrc(`baloo-2/files/baloo-2-latin-${w}-normal.woff2`)}) format("woff2")}`)
  .concat([400, 600, 700, 800, 900].map((w) => `@font-face{font-family:"Nunito";font-weight:${w};src:url(${fsrc(`nunito/files/nunito-latin-${w}-normal.woff2`)}) format("woff2")}`)).join('\n');
fs.writeFileSync(path.join(test, 'tokens.css'), tokensCss(tokens));
fs.writeFileSync(path.join(test, 'fonts.css'), fontFaces);
const reactUmd = 'file://' + path.join(root, 'node_modules/react/umd/react.production.min.js');
const reactDomUmd = 'file://' + path.join(root, 'node_modules/react-dom/umd/react-dom.production.min.js');
export function harness(previewPath, outName) {
  let html = fs.readFileSync(previewPath, 'utf8').replace(/^<!--.*?-->\n/, '');
  const pre = `<link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="../out/project/components/bundle.css">
<script src="${reactUmd}"></script><script src="${reactDomUmd}"></script><script src="../out/project/components/bundle.js"></script>`;
  html = html.replace(/<html([^>]*)>/i, `<html$1 data-theme="toybox">`).replace(/<head>/i, '<head>' + pre);
  fs.writeFileSync(path.join(test, outName), html);
}
harness(path.join(out, 'components/Prototype/preview.html'), 'prototype.html');
for (const dir of fs.readdirSync(path.join(out, 'components'))) {
  const p = path.join(out, 'components', dir, 'preview.html');
  if (dir !== 'Prototype' && fs.existsSync(p)) harness(p, dir + '.html');
}
console.log('bundle', bundle.length, 'proto html', protoHtml.length);
