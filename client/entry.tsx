import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'supadocs/client/App';
import 'supadocs/client/styles/global.css';
// @ts-ignore virtual module
import config from 'virtual:supadocs-config';

// Apply custom theme from config
const theme = config.theme || {};
const root = document.documentElement;

if (theme.accent) root.style.setProperty('--sd-accent', theme.accent);
if (theme.accentHover) root.style.setProperty('--sd-accent-hover', theme.accentHover);
if (theme.font) root.style.setProperty('--sd-font', theme.font);
if (theme.fontHeading) root.style.setProperty('--sd-font-heading', theme.fontHeading);
if (theme.fontMono) root.style.setProperty('--sd-font-mono', theme.fontMono);
if (theme.radius) root.style.setProperty('--sd-radius', theme.radius);

// Full color overrides
if (theme.colors) {
  const c = theme.colors;
  if (c.bg) root.style.setProperty('--sd-bg', c.bg);
  if (c.bgCard) root.style.setProperty('--sd-bg-card', c.bgCard);
  if (c.bgSurface) root.style.setProperty('--sd-bg-surface', c.bgSurface);
  if (c.text) root.style.setProperty('--sd-text', c.text);
  if (c.textHeading) root.style.setProperty('--sd-text-heading', c.textHeading);
  if (c.textMuted) root.style.setProperty('--sd-text-muted', c.textMuted);
  if (c.border) root.style.setProperty('--sd-border', c.border);
}

// Custom CSS injection
if (theme.customCss) {
  const style = document.createElement('style');
  style.textContent = theme.customCss;
  document.head.appendChild(style);
}

// Set document title and favicon
if (config.name) document.title = `${config.name} Docs`;
if (config.favicon) {
  let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = config.favicon;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
