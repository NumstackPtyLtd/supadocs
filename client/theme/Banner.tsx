import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface BannerProps {
  text: string;
  href?: string;
  dismissible?: boolean;
}

export function Banner({ text, href, dismissible = true }: BannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('sd-banner-dismissed') === '1'; } catch { return false; }
  });

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    try { sessionStorage.setItem('sd-banner-dismissed', '1'); } catch {}
  }

  const content = (
    <>
      <span className="sd-banner-text">{text}</span>
      {href && <ArrowRight size={13} />}
    </>
  );

  return (
    <div className="sd-banner">
      <div className="sd-banner-inner">
        {href ? (
          <a href={href} className="sd-banner-link">{content}</a>
        ) : (
          <span className="sd-banner-link">{content}</span>
        )}
        {dismissible && (
          <button className="sd-banner-close" onClick={handleDismiss} aria-label="Dismiss">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
