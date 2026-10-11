import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// The design system lives in ../source/src (tokens, components, component CSS).
const DS = path.resolve(import.meta.dirname, '../source/src');

// Turns tokens.json into CSS custom properties + type classes (same output as source/build.mjs).
function tokensCss(t) {
  const L = [];
  const first = t.color.themes[0].id;
  const val = (v) => (typeof v === 'string' ? v : v[first]);
  const alias = (v) => (/^\{(.+)\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v);
  L.push(':root {');
  for (const c of t.color.tokens) L.push(`  --${c.name}: ${alias(val(c.value))};`);
  for (const s of t.shadow?.tokens || []) L.push(`  --${s.name}: ${val(s.value)};`);
  for (const fam of ['spacing', 'radius', 'size']) for (const s of t[fam]?.tokens || []) L.push(`  --${s.name}: ${s.value};`);
  for (const [k, v] of Object.entries(t.type.families)) L.push(`  --font-${k}: ${v};`);
  L.push('}');
  for (const g of t.type.groups) for (const s of g.styles) {
    L.push(`.${s.name} { font-family: var(--font-${s.family || g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; letter-spacing: ${s.letterSpacing || 'normal'}; }`);
  }
  return L.join('\n') + '\n';
}

function designTokens() {
  const id = 'virtual:tokens.css';
  const file = path.join(DS, 'tokens.json');
  return {
    name: 'design-system',
    enforce: 'pre',
    // components.jsx has no import/export, so the JSX transform would treat it as CommonJS (require).
    transform: (code, file) => (file.startsWith(DS) && file.endsWith('.jsx') ? code + '\nexport {};\n' : null),
    resolveId: (s) => (s === id ? '\0' + id : null),
    load(s) {
      if (s !== '\0' + id) return null;
      this.addWatchFile(file);
      return tokensCss(JSON.parse(fs.readFileSync(file, 'utf8')));
    },
  };
}

export default defineConfig({
  plugins: [react(), designTokens()],
  resolve: {
    alias: { '@ds': DS },
    // components.jsx sits outside this folder; make it use our copy of React.
    dedupe: ['react', 'react-dom'],
  },
  // /api/* is a Cloudflare Pages Function: `npx wrangler pages dev dist` serves it on 8788
  server: { fs: { allow: ['..'] }, proxy: { '/api': 'http://localhost:8788' } },
});
