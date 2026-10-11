# Crash Test Buddy

A crash test for AI toys: test them, protect them with the Safety Shield, and let parents check the grade on the box.

## What's in here

- **prototype.html**: the clickable prototype in one file. Double-click it to open it in any browser (Chrome, Edge, Safari, Firefox). It works offline; the rounded fonts load when you're online. Tap "Watch how it works" to play the whole story by itself.
- **design-system/**: the look and the parts.
  - `README.md`: the style guide (words, colors, type, motion, Buddy, icons).
  - `tokens.json`: every color, size, spacing and shadow.
  - `components/bundle.js` and `components/bundle.css`: the 19 parts (React 18), loaded as `window.CTB`.
  - `components/<Name>/`: a guide (`README.md`) and a live demo (`preview.html`) for each part.
  - `assets/`: Buddy, the four toys, the families and all icons as SVG files.
- **source/**: the editable code.
  - `src/components.jsx`: the parts. `src/prototype.jsx` and `src/prototype.css`: the six screens and the self-playing demo.
  - `src/bundle.css`: the parts' styles. `src/tokens.json`: the tokens.

## The website (site/)

`site/` is the prototype website: a landing page at `/` and the working app at `/app` (Talk, Crash test, Report card, Shipments, Parent scan, and the self-playing tour at `/app?tour=1`). Everything runs in the browser. There is no backend, and all data is made up.

It reuses the design system straight from `source/src` (`tokens.json`, `components.jsx`, `bundle.css`), and adds a neobrutalist shell on top in `site/src/neo.css`.

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # static files in site/dist
npm run lint
```

### Hosting (Cloudflare Pages)

Live at **https://crash-test-buddy.pages.dev**. The Pages project `crash-test-buddy` is connected to this repo (Root directory `site`, Build command `npm run build`, Build output `dist`; the Node version comes from `site/.node-version`):

- A push to `main` deploys to production.
- A push to any other branch gets its own preview URL.

You can still deploy by hand with `cd site && npx wrangler login && npm run deploy`.

There is no `404.html`, so Pages serves `index.html` for every path and links like `/app/talk` work. `site/public/_headers` caches the hashed assets.

## Change and rebuild

1. Install Node.js 18 or newer.
2. In the `source` folder run `npm install`, then `npm run build`.
3. The new files are written to `source/out/project/`. Open `source/test/prototype.html` in a browser to try your changes.
4. `npm run single` makes a new one-file `prototype.html` you can send to anyone.
5. `npm run svgs` re-exports the SVG pictures to `source/assets/`.
