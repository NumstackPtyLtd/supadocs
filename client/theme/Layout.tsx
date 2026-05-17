import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TOC } from './TOC';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { MDXContent } from './MDXProvider';
import { Landing } from './Landing';
import { VersionBanner } from './VersionBanner';
import { Banner } from './Banner';
import type { PageMeta } from 'supadocs/client/App';

interface LayoutProps {
  config: any;
  currentSlug: string;
  page: PageMeta | null;
  pageMap: Map<string, PageMeta>;
  versionInfo?: { version: string; slug: string } | null;
  currentVersionLabel?: string;
}

export function Layout({ config, currentSlug, page, pageMap, versionInfo, currentVersionLabel }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(() => {
    if (!config.banner) return false;
    try { return sessionStorage.getItem('sd-banner-dismissed') !== '1'; } catch { return true; }
  });
  const location = useLocation();
  const isLanding = location.pathname === '/' && config.landing;
  const versionPrefix = versionInfo ? versionInfo.slug.split('/')[0] : '';
  const breadcrumb = findBreadcrumb(config.navigation, versionPrefix ? currentSlug.replace(`${versionPrefix}/`, '') : currentSlug);

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

  // Apply version-specific accent colour
  useEffect(() => {
    if (versionInfo && config.versions) {
      const v = config.versions.find((ver: any) => ver.label === versionInfo.version);
      if (v?.accent) {
        document.documentElement.style.setProperty('--sd-accent', v.accent);
        document.documentElement.style.setProperty('--sd-accent-subtle', `${v.accent}18`);
        return () => {
          const defaultAccent = config.theme?.accent || '#6B9FE8';
          document.documentElement.style.setProperty('--sd-accent', defaultAccent);
          document.documentElement.style.setProperty('--sd-accent-subtle', `${defaultAccent}18`);
        };
      }
    }
  }, [versionInfo?.version]);

  return (
    <div className={`sd-layout ${bannerVisible ? 'sd-has-banner' : ''}`}>
      {bannerVisible && (
        <Banner
          text={config.banner.text}
          href={config.banner.href}
          dismissible={config.banner.dismissible}
          onDismiss={() => setBannerVisible(false)}
        />
      )}
      <Header config={config} onMenuToggle={() => setMobileNavOpen(!mobileNavOpen)} versionPrefix={versionPrefix} />

      <MobileNav
        config={config}
        currentSlug={currentSlug}
        pageMap={pageMap}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        versionPrefix={versionPrefix}
      />

      {isLanding ? (
        <div className="sd-landing-wrap">
          <Landing config={config} />
        </div>
      ) : (
        <div className="sd-body">
          <aside className="sd-sidebar">
            <Sidebar config={config} currentSlug={currentSlug} pageMap={pageMap} versionPrefix={versionPrefix} />
          </aside>

          <main className="sd-content">
            {versionInfo && (
              <VersionBanner
                version={versionInfo.version}
                currentLabel={currentVersionLabel || 'latest'}
              />
            )}
            {page ? (
              <>
                {breadcrumb && <div className="sd-breadcrumb">{breadcrumb}</div>}
                <h1 className="sd-page-title">{page.title}</h1>
                {page.description && <p className="sd-page-description">{page.description}</p>}
                <div className="sd-prose">
                  <MDXContent Component={page.Component} />
                </div>
                <Footer config={config} versionPrefix={versionPrefix} />
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
