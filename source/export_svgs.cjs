// Renders the illustration components to standalone SVG files with token values baked in.
const fs = require('fs'), path = require('path');
const React = require('react'); const { renderToStaticMarkup } = require('react-dom/server');
globalThis.window = globalThis; window.React = React;
eval(fs.readFileSync(path.join(__dirname, 'out/project/components/bundle.js'), 'utf8'));
const CTB = window.CTB;
const t = JSON.parse(fs.readFileSync(path.join(__dirname, 'out/project/tokens.json'), 'utf8'));
const vals = {};
for (const c of t.color.tokens) vals[c.name] = typeof c.value === 'string' ? c.value : Object.values(c.value)[0];
for (const [k, v] of Object.entries(t.type.families)) vals['font-' + k] = v.replace(/"/g, "'");
const bake = (svg) => svg
  .replace(/var\(--([a-z0-9-]+)\)/g, (m, n) => { if (!(n in vals)) throw new Error('no token ' + n); return vals[n]; })
  .replace(/ class="[^"]*"/g, '').replace(/ aria-hidden="true"| role="img"| focusable="false"/g, '')
  .replace(/<svg /, '<svg xmlns="http://www.w3.org/2000/svg" ');
const outDir = path.join(__dirname, 'assets'); fs.rmSync(outDir, { recursive: true, force: true });
const put = (group, name, el) => {
  fs.mkdirSync(path.join(outDir, group), { recursive: true });
  const svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + bake(renderToStaticMarkup(el)) + '\n';
  fs.writeFileSync(path.join(outDir, group, name), svg);
};
const h = React.createElement;
put('Mascot', 'buddy-wave.svg', h(CTB.Buddy, { pose: 'wave', size: 480, title: 'Buddy waving' }));
put('Mascot', 'buddy-shield.svg', h(CTB.Buddy, { pose: 'shield', size: 480, title: 'Buddy holding the Safety Shield' }));
put('Mascot', 'buddy-cheer.svg', h(CTB.Buddy, { pose: 'cheer', size: 480, title: 'Buddy cheering' }));
put('Mascot', 'buddy-head.svg', h(CTB.Buddy, { crop: 'head', size: 296, title: 'Buddy' }));
for (const [k, file] of [['bear', 'cuddle-bear.svg'], ['robot', 'robo-pal.svg'], ['dino', 'dino-chat.svg'], ['bunny', 'bunny-buds.svg']]) {
  put('Toys', file, h(CTB.ToyFriend, { kind: k, size: 400 }));
}
for (const f of ['mom-kid', 'dad-kid', 'grandma-kid']) put('Families', 'family-' + f + '.svg', h(CTB.FamilyArt, { family: f, size: 480, title: f.replace('-kid', ' and child') }));
for (const n of CTB.ICON_NAMES) put('Icons', n + '.svg', h(CTB.Icon, { name: n, size: 96 }));
console.log(fs.readdirSync(outDir).map((g) => g + ': ' + fs.readdirSync(path.join(outDir, g)).length).join(', '));
