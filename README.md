# supadocs

Opinionated docs framework. MDX in, beautiful site out.

- Dark/light themes out of the box
- Built-in components: callouts, cards, tabs, steps, accordions, code groups
- Cmd+K search across all pages
- Landing page with cards
- Full theme customisation
- Any [Lucide](https://lucide.dev) icon by name
- Zero config in your project. Just MDX files and a `docs.config.js`

## Quick start

```bash
# In your project
npx supadocs init
npx supadocs dev
```

This creates:

```
docs/
  introduction.mdx
docs.config.js
```

Open `http://localhost:3900`.

## Usage

### 1. Install

```bash
npm install supadocs
```

### 2. Create `docs.config.js`

```js
export default {
  name: 'My Project',
  docsDir: 'docs',

  theme: {
    accent: '#6366F1',
  },

  landing: {
    headline: 'My Project Docs',
    description: 'Everything you need to get started.',
    primaryAction: { label: 'Get Started', href: '/introduction' },
    cards: [
      { title: 'Quick Start', description: 'Up and running in 5 minutes.', icon: 'rocket', href: '/quickstart' },
    ],
  },

  navigation: [
    { group: 'Getting Started', pages: ['introduction', 'quickstart'] },
  ],

  links: [
    { label: 'GitHub', href: 'https://github.com/you/repo', icon: 'github' },
  ],
};
```

### 3. Write MDX

```mdx
---
title: Introduction
description: Welcome to the docs.
---

## Hello

<Note>
Built-in components are available in every MDX file. No imports needed.
</Note>

<CardGroup cols={2}>
  <Card title="Guide" icon="book-open" href="/guide">
    Step-by-step walkthrough.
  </Card>
  <Card title="API" icon="code" href="/api">
    Full API reference.
  </Card>
</CardGroup>
```

### 4. Run

```bash
npx supadocs dev     # dev server on :3900
npx supadocs build   # static site to dist-docs/
```

## Components

All components are available in MDX without importing.

| Component | Usage |
|-----------|-------|
| `<Note>` | Info callout (blue) |
| `<Warning>` | Warning callout (yellow) |
| `<Tip>` | Tip callout (green) |
| `<Info>` | Info callout (blue) |
| `<Card title="" icon="" href="">` | Feature card. `icon` is any [Lucide](https://lucide.dev/icons) icon name. |
| `<CardGroup cols={2}>` | Grid of cards |
| `<CodeGroup>` | Tabbed code blocks |
| `<Tabs>` / `<Tab label="">` | Generic tabs |
| `<Steps>` / `<Step title="">` | Step-by-step guide |
| `<Accordion title="">` | Collapsible section |

## Config reference

```js
export default {
  name: 'Project Name',
  logo: '/logo.svg',                        // or { light: '...', dark: '...' }
  favicon: '/favicon.png',
  docsDir: 'docs',                           // or '.' for root-level MDX
  port: 3900,
  outDir: 'dist-docs',

  theme: {
    accent: '#FF6C37',
    accentHover: '#E85A28',
    font: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    radius: '6px',
    colors: {                                // override any CSS variable
      bg: '#FAF8F6',
      bgCard: '#FFFFFF',
      bgSurface: '#F2EFEB',
      text: '#5C5650',
      textHeading: '#2D2A26',
      textMuted: '#9C958E',
      border: '#E8E4DE',
    },
    customCss: '',                           // raw CSS injected into <head>
  },

  landing: {
    headline: 'Project Docs',
    description: '...',
    primaryAction: { label: 'Get Started', href: '/intro' },
    secondaryAction: { label: 'GitHub', href: '...' },
    cards: [
      { title: '...', description: '...', icon: 'rocket', href: '/...' },
    ],
  },

  navigation: [
    { group: 'Section', pages: ['page-slug', 'folder/page'] },
  ],

  tabs: [
    { label: 'Docs', href: '/introduction' },
    { label: 'API', href: '/api/overview' },
  ],

  links: [
    { label: 'GitHub', href: '...', icon: 'github' },
  ],
};
```

## Example

See the [`example/`](./example) directory for a complete working example.

```bash
cd example
npx supadocs dev
```

## Documentation

Full documentation at [docs.supaproxy.cloud](https://docs.supaproxy.cloud/introduction).

## Package exports

The `./components` export points to raw TypeScript source (`client/components/index.ts`). This is intentional: supadocs is a Vite-based framework and is consumed by projects that run through Vite, which handles TypeScript natively. The source export works correctly in that context.

If you are importing supadocs components outside of a Vite pipeline, you will need to compile the TypeScript yourself.

## License

MIT
