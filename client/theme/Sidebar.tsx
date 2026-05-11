import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';
import type { PageMeta } from 'supadocs/client/App';

interface SidebarProps {
  config: any;
  currentSlug: string;
  pageMap: Map<string, PageMeta>;
}

export function Sidebar({ config, currentSlug, pageMap }: SidebarProps) {
  return (
    <nav className="sd-nav">
      {config.links?.map((link: any) => (
        <a key={link.href} href={link.href} className="sd-nav-external" target="_blank" rel="noopener">
          {link.icon === 'github' ? <Github size={14} strokeWidth={1.75} /> : <ExternalLink size={14} strokeWidth={1.75} />}
          <span>{link.label || 'GitHub'}</span>
        </a>
      ))}

      {config.navigation?.map((group: any) => (
        <div key={group.group} className="sd-nav-group">
          <div className="sd-nav-group-title">{group.group}</div>
          <ul className="sd-nav-list">
            {group.pages?.map((slug: string) => {
              const page = pageMap.get(slug);
              const isActive = currentSlug === slug;
              return (
                <li key={slug}>
                  <Link
                    to={`/${slug}`}
                    className={`sd-nav-item ${isActive ? 'sd-nav-item-active' : ''}`}
                  >
                    {page?.title || slug.split('/').pop()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
