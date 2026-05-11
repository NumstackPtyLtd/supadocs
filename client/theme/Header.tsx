import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, ExternalLink } from 'lucide-react';
// @ts-ignore virtual module
import config from 'virtual:supadocs-config';
// @ts-ignore virtual module
import pages from 'virtual:supadocs-pages';

interface HeaderProps {
  config: any;
  onMenuToggle: () => void;
}

export function Header({ config, onMenuToggle }: HeaderProps) {
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });
  const [searchOpen, setSearchOpen] = useState(false);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('supadocs-theme', next);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="sd-header">
        <div className="sd-header-inner">
          <div className="sd-header-left">
            <button className="sd-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
              <Menu size={18} strokeWidth={2} />
            </button>
            <a href="/" className="sd-logo">
              {config.logo ? (
                <img src={typeof config.logo === 'string' ? config.logo : (theme === 'dark' ? config.logo.dark : config.logo.light)} alt={config.name} className="sd-logo-img" />
              ) : (
                <span>{config.name}</span>
              )}
            </a>
          </div>

          <button className="sd-search-trigger" onClick={() => setSearchOpen(true)}>
            <Search size={14} strokeWidth={2} />
            <span>Search...</span>
            <kbd>&#8984;K</kbd>
          </button>

          <div className="sd-header-right">
            {config.links?.map((link: any) => (
              <a key={link.href} href={link.href} className="sd-header-link" target="_blank" rel="noopener">
                {link.icon === 'github' ? <GithubIcon /> : <ExternalLink size={14} strokeWidth={1.75} />}
                {link.label && <span className="sd-header-link-label">{link.label}</span>}
              </a>
            ))}
            <button className="sd-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {config.tabs?.length > 0 && (
          <div className="sd-tabs-bar">
            {config.tabs.map((tab: any) => (
              <a key={tab.href} href={tab.href} className="sd-tab">{tab.label}</a>
            ))}
          </div>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const docsDir = config.docsDir || 'docs';

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches: { slug: string; title: string; description?: string }[] = [];

    for (const [path, mod] of Object.entries(pages) as [string, any][]) {
      const slug = docsDir === '.' ? path.replace(/^\//, '').replace(/\.mdx?$/, '') : path.replace(`/${docsDir}/`, '').replace(/\.mdx?$/, '');
      const title = mod.frontmatter?.title || slug;
      const desc = mod.frontmatter?.description || '';
      if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || slug.toLowerCase().includes(q)) {
        matches.push({ slug, title, description: desc });
      }
    }
    return matches.slice(0, 10);
  }, [query]);

  return (
    <div className="sd-search-overlay" onClick={onClose}>
      <div className="sd-search-modal" onClick={e => e.stopPropagation()}>
        <div className="sd-search-input-wrap">
          <Search size={16} strokeWidth={2} />
          <input ref={inputRef} type="text" placeholder="Search documentation..." value={query} onChange={e => setQuery(e.target.value)} className="sd-search-input" />
          <kbd onClick={onClose}>Esc</kbd>
        </div>
        {results.length > 0 && (
          <div className="sd-search-results">
            {results.map(r => (
              <button key={r.slug} className="sd-search-result" onClick={() => { navigate(`/${r.slug}`); onClose(); }}>
                <span className="sd-search-result-title">{r.title}</span>
                {r.description && <span className="sd-search-result-desc">{r.description}</span>}
              </button>
            ))}
          </div>
        )}
        {query && results.length === 0 && <div className="sd-search-empty">No results found.</div>}
      </div>
    </div>
  );
}
