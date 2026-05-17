import React from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
// @ts-ignore virtual module
import config from 'virtual:supadocs-config';
// @ts-ignore virtual module
import pages from 'virtual:supadocs-pages';

interface FooterProps { config: any; versionPrefix?: string; }

export function Footer({ config: cfg, versionPrefix = '' }: FooterProps) {
  const location = useLocation();
  const linkPrefix = versionPrefix ? `/${versionPrefix}` : '';
  const slug = versionPrefix
    ? location.pathname.slice(1).replace(`${versionPrefix}/`, '')
    : location.pathname.slice(1);
  const docsDir = cfg.docsDir || 'docs';

  const allPages: string[] = [];
  cfg.navigation?.forEach((g: any) => { g.pages?.forEach((p: string) => allPages.push(p)); });

  const currentIdx = allPages.indexOf(slug);
  const prev = currentIdx > 0 ? allPages[currentIdx - 1] : null;
  const next = currentIdx < allPages.length - 1 ? allPages[currentIdx + 1] : null;

  function getTitle(s: string) {
    const lookupSlug = versionPrefix ? `${versionPrefix}/${s}` : s;
    for (const [path, mod] of Object.entries(pages) as [string, any][]) {
      const ps = docsDir === '.' ? path.replace(/^\//, '').replace(/\.mdx?$/, '') : path.replace(`/${docsDir}/`, '').replace(/\.mdx?$/, '');
      if (ps === lookupSlug || ps === s) return mod.frontmatter?.title || s.split('/').pop();
    }
    return s.split('/').pop();
  }

  return (
    <div className="sd-footer">
      <div className="sd-footer-nav">
        {prev ? (
          <a href={`${linkPrefix}/${prev}`} className="sd-footer-link sd-footer-prev">
            <ArrowLeft size={14} strokeWidth={2} />
            <span>{getTitle(prev)}</span>
          </a>
        ) : <div />}
        {next ? (
          <a href={`${linkPrefix}/${next}`} className="sd-footer-link sd-footer-next">
            <span>{getTitle(next)}</span>
            <ArrowRight size={14} strokeWidth={2} />
          </a>
        ) : <div />}
      </div>
      <div className="sd-footer-meta">
        Built with <a href="https://github.com/NumstackPtyLtd/supadocs" target="_blank" rel="noopener">supadocs</a>
      </div>
    </div>
  );
}
