#!/usr/bin/env node

import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync } from 'fs';
import { createServer, build } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeSupalight from '@supaproxy/supalight/rehype';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const cwd = process.cwd();

const command = process.argv[2];

if (!command || command === '--help' || command === '-h') {
  console.log(`
  supadocs - Opinionated docs framework

  Usage:
    supadocs dev     Start dev server
    supadocs build   Build static site
    supadocs init    Scaffold a new docs project
  `);
  process.exit(0);
}

function loadConfig() {
  const configPath = resolve(cwd, 'docs.config.js');
  const configMjsPath = resolve(cwd, 'docs.config.mjs');

  if (existsSync(configMjsPath)) {
    return import(configMjsPath).then(m => m.default);
  }
  if (existsSync(configPath)) {
    return import(configPath).then(m => m.default);
  }

  console.error('No docs.config.js found in current directory.');
  process.exit(1);
}

// Auto-inject component imports into MDX files
function mdxComponentInjector(pkgRoot) {
  const componentsPath = join(pkgRoot, 'client', 'components', 'index.ts').replace(/\\/g, '/');
  const importStatement = `import { Note, Warning, Tip, Info, Card, CardGroup, CodeGroup, Steps, Step, Tabs, Tab, Accordion } from '${componentsPath}';\n`;

  return {
    name: 'supadocs-mdx-inject',
    enforce: 'pre',
    transform(code, id) {
      if (/\.mdx?$/.test(id) && !id.includes('node_modules')) {
        const fmMatch = code.match(/^---\n[\s\S]*?\n---\n/);
        if (fmMatch) {
          return fmMatch[0] + importStatement + code.slice(fmMatch[0].length);
        }
        return importStatement + code;
      }
    },
  };
}

function supadocsPlugin(config) {
  const virtualModuleId = 'virtual:supadocs-config';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const pagesModuleId = 'virtual:supadocs-pages';
  const resolvedPagesModuleId = '\0' + pagesModuleId;

  return {
    name: 'supadocs',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
      if (id === pagesModuleId) return resolvedPagesModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(config)}`;
      }
      if (id === resolvedPagesModuleId) {
        const docsDir = config.docsDir || 'docs';
        if (docsDir === '.') {
          return `
            const modules = import.meta.glob(
              ['/**/*.mdx', '!/**/node_modules/**', '!/**/dist/**', '!/**/dist-docs/**'],
              { eager: true }
            );
            export default modules;
          `;
        }
        return `
          const modules = import.meta.glob('/${docsDir}/**/*.mdx', { eager: true });
          export default modules;
        `;
      }
    },
  };
}

function createViteConfig(config) {
  // Resolve deps from user's node_modules first (hoisted), then supadocs's own
  const userModules = join(cwd, 'node_modules');
  const supadocsModules = join(pkgRoot, 'node_modules');

  function resolveModule(name) {
    const userPath = join(userModules, name);
    return existsSync(userPath) ? userPath : join(supadocsModules, name);
  }

  return {
    root: cwd,
    resolve: {
      alias: {
        'supadocs/client': join(pkgRoot, 'client'),
        'react': resolveModule('react'),
        'react-dom': resolveModule('react-dom'),
        'react-router-dom': resolveModule('react-router-dom'),
        'react/jsx-runtime': join(resolveModule('react'), 'jsx-runtime.js'),
        'react/jsx-dev-runtime': join(resolveModule('react'), 'jsx-dev-runtime.js'),
      },
    },
    plugins: [
      mdxComponentInjector(pkgRoot),
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
          rehypePlugins: [rehypeSupalight],
          providerImportSource: undefined,
        }),
      },
      react({ include: /\.(tsx?|mdx?)$/ }),
      supadocsPlugin(config),
    ],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'react/jsx-runtime'],
    },
    server: {
      port: config.port || 3900,
      fs: {
        allow: [cwd, pkgRoot],
      },
    },
  };
}

async function dev() {
  const config = await loadConfig();
  const viteConfig = createViteConfig(config);

  const htmlPath = join(pkgRoot, 'client', 'index.html');

  viteConfig.plugins.push({
    name: 'supadocs-html',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || (!req.url.includes('.') && !req.url.startsWith('/@'))) {
          const html = readFileSync(htmlPath, 'utf-8');
          const entryPath = join(pkgRoot, 'client', 'entry.tsx');
          const transformedHtml = html.replace(
            '/__ENTRY__',
            `/@fs/${entryPath}`
          );
          server.transformIndexHtml(req.url, transformedHtml).then(result => {
            res.setHeader('Content-Type', 'text/html');
            res.end(result);
          });
          return;
        }
        next();
      });
    },
  });

  const server = await createServer(viteConfig);
  await server.listen();
  server.printUrls();
}

async function buildSite() {
  const config = await loadConfig();
  const viteConfig = createViteConfig(config);

  // For build, write index.html with absolute entry path to cwd
  const entryPath = join(pkgRoot, 'client', 'entry.tsx');
  const htmlContent = readFileSync(join(pkgRoot, 'client', 'index.html'), 'utf-8')
    .replace('/__ENTRY__', entryPath);

  const tmpHtml = resolve(cwd, 'index.html');
  const { writeFileSync, unlinkSync } = await import('fs');
  writeFileSync(tmpHtml, htmlContent);

  // Allow serving from pkgRoot during build
  viteConfig.build = {
    outDir: config.outDir || 'dist-docs',
    emptyOutDir: true,
    rollupOptions: {
      input: tmpHtml,
    },
  };

  try {
    await build(viteConfig);
    console.log('\nBuild complete!');
  } finally {
    if (existsSync(tmpHtml)) unlinkSync(tmpHtml);
  }
}

async function init() {
  const { mkdirSync, writeFileSync } = await import('fs');

  if (!existsSync(resolve(cwd, 'docs'))) {
    mkdirSync(resolve(cwd, 'docs'), { recursive: true });
  }

  if (!existsSync(resolve(cwd, 'docs', 'introduction.mdx'))) {
    writeFileSync(resolve(cwd, 'docs', 'introduction.mdx'), `---
title: Introduction
description: Welcome to the docs.
---

# Introduction

Welcome to the documentation. Edit this file to get started.

<Note>
This is a callout. Use Note, Warning, Tip, and Info components in your MDX.
</Note>
`);
  }

  if (!existsSync(resolve(cwd, 'docs.config.js'))) {
    writeFileSync(resolve(cwd, 'docs.config.js'), `/** @type {import('supadocs').Config} */
export default {
  name: 'My Project',
  // logo: '/logo.svg',
  // favicon: '/favicon.png',
  docsDir: 'docs',

  theme: {
    accent: '#FF6C37',
  },

  navigation: [
    {
      group: 'Getting Started',
      pages: ['introduction'],
    },
  ],

  tabs: [],
  links: [],
};
`);
  }

  console.log('Initialized supadocs project.');
  console.log('  docs/introduction.mdx');
  console.log('  docs.config.js');
  console.log('\nRun `npx supadocs dev` to start.');
}

switch (command) {
  case 'dev':
    dev();
    break;
  case 'build':
    buildSite();
    break;
  case 'init':
    init();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
