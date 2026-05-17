import React from 'react';
import { X, ArrowRight } from 'lucide-react';

interface BannerProps {
  text: string;
  href?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Banner({ text, href, dismissible = true, onDismiss }: BannerProps) {
  function handleDismiss() {
    try { sessionStorage.setItem('sd-banner-dismissed', '1'); } catch {}
    onDismiss?.();
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
