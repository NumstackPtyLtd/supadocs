import React, { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore virtual module
import config from 'virtual:supadocs-config';
// @ts-ignore virtual module
import pages from 'virtual:supadocs-pages';
import { Layout } from 'supadocs/client/theme/Layout';

export interface PageMeta {
  slug: string;
  title: string;
  description?: string;
  Component: React.ComponentType;
}

function resolvePages(): Map<string, PageMeta> {
  const docsDir = config.docsDir || 'docs';
  const map = new Map<string, PageMeta>();

  for (const [path, mod] of Object.entries(pages) as [string, any][]) {
    let slug: string;
    if (docsDir === '.') {
      slug = path.replace(/^\//, '').replace(/\.mdx?$/, '');
    } else {
      slug = path.replace(`/${docsDir}/`, '').replace(/\.mdx?$/, '');
    }

    map.set(slug, {
      slug,
      title: mod.frontmatter?.title || slug.split('/').pop() || slug,
      description: mod.frontmatter?.description,
      Component: mod.default,
    });
  }

  return map;
}

function getFirstPage(): string {
  if (config.navigation?.length > 0) {
    const first = config.navigation[0];
    if (first.pages?.length > 0) return first.pages[0];
  }
  return 'introduction';
}

/** Detect if current path is a versioned route. Returns { version, slug } or null. */
function parseVersionFromPath(pathname: string): { version: string; slug: string } | null {
  if (!config.versions?.length) return null;
  const path = pathname.slice(1); // strip leading /
  for (const v of config.versions) {
    if (v.default) continue;
    const prefix = v.path.replace(/^\//, '');
    if (path === prefix || path.startsWith(prefix + '/')) {
      const slug = path.slice(prefix.length + 1) || getFirstPage();
      return { version: v.label, slug: `${prefix}/${slug}` };
    }
  }
  return null;
}

/** Get the current (default) version label. */
function getCurrentVersionLabel(): string {
  if (!config.versions?.length) return '';
  const current = config.versions.find((v: any) => v.default);
  return current?.label || config.versions[0]?.label || '';
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageMap = useMemo(() => resolvePages(), []);

  const isRoot = location.pathname === '/';
  const hasLanding = !!config.landing;
  const versionInfo = parseVersionFromPath(location.pathname);

  const slug = isRoot ? getFirstPage() : (versionInfo ? versionInfo.slug : location.pathname.slice(1));
  const page = pageMap.get(slug);

  // Only redirect / to first page if there's no landing page configured
  useEffect(() => {
    if (isRoot && !hasLanding) {
      navigate(`/${getFirstPage()}`, { replace: true });
    }
  }, [location.pathname]);

  return (
    <Layout
      config={config}
      currentSlug={slug}
      page={isRoot && hasLanding ? null : (page || null)}
      pageMap={pageMap}
      versionInfo={versionInfo}
      currentVersionLabel={getCurrentVersionLabel()}
    />
  );
}
