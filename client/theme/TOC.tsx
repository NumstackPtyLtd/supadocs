import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { List } from 'lucide-react';

interface Heading { id: string; text: string; level: number; }

function extractHeadings(): Heading[] {
  const prose = document.querySelector('.sd-prose');
  if (!prose) return [];

  const elements = prose.querySelectorAll('h2, h3');
  const items: Heading[] = [];

  elements.forEach(el => {
    if (!el.id) {
      el.id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    }
    items.push({ id: el.id, text: el.textContent || '', level: parseInt(el.tagName[1]) });
  });

  return items;
}

export function TOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');
  const location = useLocation();

  const refresh = useCallback(() => {
    setHeadings(extractHeadings());
  }, []);

  useEffect(() => {
    // Clear immediately on route change to prevent stale headings
    setHeadings([]);
    setActiveId('');

    // Try extracting after a short delay (content may already be rendered)
    const timer = setTimeout(refresh, 150);

    // Also observe DOM mutations in case content loads later
    const prose = document.querySelector('.sd-prose');
    let observer: MutationObserver | null = null;

    if (prose) {
      observer = new MutationObserver(() => {
        const found = extractHeadings();
        if (found.length > 0) {
          setHeadings(found);
          observer?.disconnect();
        }
      });
      observer.observe(prose, { childList: true, subtree: true });
    } else {
      // Prose element might not exist yet; watch the body
      observer = new MutationObserver(() => {
        const el = document.querySelector('.sd-prose');
        if (el) {
          const found = extractHeadings();
          if (found.length > 0) {
            setHeadings(found);
          }
          observer?.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // Clean up after 3 seconds max
    const cleanup = setTimeout(() => observer?.disconnect(), 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
      observer?.disconnect();
    };
  }, [location.pathname, refresh]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setActiveId(entry.target.id); break; }
        }
      },
      { rootMargin: '-60px 0px -65% 0px' }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sd-toc-nav">
      <div className="sd-toc-title">
        <List size={12} strokeWidth={2} />
        On this page
      </div>
      <ul className="sd-toc-list">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`sd-toc-link ${h.level === 3 ? 'sd-toc-link-sub' : ''} ${activeId === h.id ? 'sd-toc-link-active' : ''}`}
              onClick={e => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' }); setActiveId(h.id); }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
