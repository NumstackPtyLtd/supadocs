import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import type { PageMeta } from 'supadocs/client/App';

interface MobileNavProps {
  config: any;
  currentSlug: string;
  pageMap: Map<string, PageMeta>;
  open: boolean;
  onClose: () => void;
  versionPrefix?: string;
}

export function MobileNav({ config, currentSlug, pageMap, open, onClose, versionPrefix }: MobileNavProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="sd-mobile-overlay" onClick={onClose}>
      <div className="sd-mobile-nav" onClick={e => e.stopPropagation()}>
        <div className="sd-mobile-nav-header">
          <span className="sd-mobile-nav-title">{config.name}</span>
          <button className="sd-mobile-close" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        {config.tabs?.length > 0 && (
          <div className="sd-mobile-tabs">
            {config.tabs.map((tab: any) => (
              <a key={tab.href} href={tab.href} className="sd-mobile-tab" onClick={onClose}>
                {tab.label}
              </a>
            ))}
          </div>
        )}
        <Sidebar config={config} currentSlug={currentSlug} pageMap={pageMap} versionPrefix={versionPrefix} />
      </div>
    </div>
  );
}
