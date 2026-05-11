# @supaproxy/supadocs

Opinionated documentation framework for the SupaProxy ecosystem. MDX in, beautiful site out. Built on Vite, React 19, and react-router-dom. Provides a CLI (`supadocs`) for dev, build, and init commands.

See the [central hub](https://github.com/NumstackPtyLtd/supaproxy) for cross-repo governance, workflow, and conventions.

## Architecture

```
bin/
└── supadocs.mjs          CLI entrypoint (dev, build, init commands)

client/
├── entry.tsx              React app entrypoint
├── App.tsx                Root app component with routing
├── index.html             HTML template
├── types.d.ts             Config type definition
├── components/            MDX components (Note, Warning, Tip, Card, CodeGroup, Steps, Tabs, Accordion)
│   └── index.ts           Component barrel export
├── theme/                 Layout components (Header, Sidebar, Footer, TOC, Landing, MDXProvider)
├── styles/                Global CSS
└── supadocs.mjs           Vite plugin logic
```

There is no `src/` directory. The framework code lives in `bin/` (CLI) and `client/` (React app and Vite plugins).

## How it works

1. Consumer projects create a `docs.config.js` (or `.mjs`) with navigation, theme, and site config.
2. Consumer projects write MDX files in a docs directory.
3. `supadocs dev` starts a Vite dev server that resolves MDX via virtual modules.
4. `supadocs build` produces a static site in `dist-docs/`.
5. MDX components (Note, Warning, Tip, etc.) are auto-injected into every MDX file at compile time.

## Config

Consumer projects define a `docs.config.js` exporting a `Config` object:

- `name`, `logo`, `favicon`, `docsDir`, `port`, `outDir`
- `theme` with accent colour, fonts, radius, custom CSS
- `navigation` array of groups with pages
- `tabs`, `links`, `footer`, `landing`

Type definition is in `client/types.d.ts`.

## Development

```bash
npm install
supadocs dev      # Dev server on port 3900 (or config.port)
supadocs build    # Static build to dist-docs/
supadocs init     # Scaffold a new docs project
```

No test suite currently. No separate build step needed for the package itself; it ships source files directly.

## Publishing

```bash
# Version bump in package.json following semver
npm publish --access public
```

Published as `@supaproxy/supadocs` on npm. Ships `bin/` and `client/` directories.

## Git workflow

- NEVER push directly to main. Always create a feature branch and open a PR.
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/` prefixes.
- NEVER run destructive git commands (`git push --force`, `git reset --hard`, `git clean -f`).
- Squash merge to main via GitHub UI.

## Code rules

- No `any` types. No `as any` casts.
- No hardcoded provider names, model IDs, or URLs.
- No em dashes or en dashes. Use commas, full stops, or semicolons.
- British English throughout (colour, organisation, behaviour).
- Straight quotes only. Sentence case for headings.

## Dependencies

- `@supaproxy/supalight` for syntax highlighting (rehype plugin).
- `@mdx-js/rollup` for MDX compilation.
- `@vitejs/plugin-react` for React JSX transform.
- `react-router-dom` for client-side routing.
