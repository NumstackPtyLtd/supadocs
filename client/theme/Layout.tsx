import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TOC } from './TOC';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { MDXContent } from './MDXProvider';
import { Landing } from './Landing';
import type { PageMeta } from 'supadocs/client/App';

interface LayoutProps {
  config: any;
  currentSlug: string;
  page: PageMeta | null;
  pageMap: Map<string, PageMeta>;
}

export function Layout({ config, currentSlug, page, pageMap }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/' && config.landing;
  const breadcrumb = findBreadcrumb(config.navigation, currentSlug);

  // Measure actual header height (including tabs bar) and set CSS variable
  useEffect(() => {
    const header = document.querySelector('.sd-header') as HTMLElement | null;
    if (header) {
      const update = () => {
        const h = header.offsetHeight;
        document.documentElement.style.setProperty('--sd-header-actual', `${h}px`);
      };
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);

  return (
    <div className="sd-layout">
      <Header config={config} onMenuToggle={() => setMobileNavOpen(!mobileNavOpen)} />

      <MobileNav
        config={config}
        currentSlug={currentSlug}
        pageMap={pageMap}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {isLanding ? (
        <div className="sd-landing-wrap">
          <Landing config={config} />
        </div>
      ) : (
        <div className="sd-body">
          <aside className="sd-sidebar">
            <Sidebar config={config} currentSlug={currentSlug} pageMap={pageMap} />
          </aside>

          <main className="sd-content">
            {page ? (
              <>
                {breadcrumb && <div className="sd-breadcrumb">{breadcrumb}</div>}
                <h1 className="sd-page-title">{page.title}</h1>
                {page.description && <p className="sd-page-description">{page.description}</p>}
                <div className="sd-prose">
                  <MDXContent Component={page.Component} />
                </div>
                <Footer config={config} />
              </>
            ) : (
              <div className="sd-not-found">
                <h1>Page not found</h1>
                <p>The page <code>{currentSlug}</code> does not exist.</p>
              </div>
            )}
          </main>

          <aside className="sd-toc">
            <TOC />
          </aside>
        </div>
      )}
    </div>
  );
}

function findBreadcrumb(navigation: any[], slug: string): string | null {
  if (!navigation) return null;
  for (const group of navigation) {
    if (group.pages?.includes(slug)) return group.group;
  }
  return null;
}
